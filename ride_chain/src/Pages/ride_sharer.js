import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import "./ride_sharer.css";
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/sidebar';
import ipfs from '../Web3 Handler/ipfs'
import contract from '../Web3 Handler/contract'
import MapPicker from 'react-google-map-picker'
import LoadingScreen from './loading';

const DefaultLocation = { lat: 29.86758323934143, lng: 77.89498881574703};
const DefaultZoom = 13;

function RideSharer(){
    
    const [submittted, setSubmitted] = useState(false);
    const [source, setSource] = useState();
    const [destination, setDestination] = useState();
    const [carNumber, setCarNumber] = useState("");
    const [carModel, setCarModel] = useState("");
    const [carSeats, setCarSeats] = useState(0);
    const [freeSeats, setFreeSeats] = useState(0);
    const [fare, setFare] = useState(0);
    const [isLoading,setIsLoading] = useState(false)
    const [isConfirmed,setIsConfirmed] =useState(false)
    const [selectedRider,setSelectedRider] = useState({})

    const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);

    const [location, setLocation] = useState(defaultLocation);
    const [zoom, setZoom] = useState(DefaultZoom);
    const [onmap, setOnMap] = useState(false);
    const [mutex, setMutex] = useState(1);

    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    function handle_authentication() {
        if (!window.localStorage.getItem('userIpfsHash')) {
            navigate('/web3_login');
        }
        else{
            console.log("Authenticated");
        }
    }

    useEffect(() => {
        handle_authentication();}, []);


    function handleChangeLocation (lat, lng){
        setLocation({lat:lat, lng:lng});
        console.log(lat, lng);
    }

    function handleChangeZoom (newZoom){
        setZoom(newZoom);
    }

    function handleResetLocation(){
        setDefaultLocation({ ... DefaultLocation});
        setZoom(DefaultZoom);
    }
    function handleSetLocation(){
        if(mutex == 1){
            setSource({
                latitude: location.lat.toPrecision(7),
                longitude: location.lng.toPrecision(7)
            })
        }
        else{
            setDestination({
                latitude: location.lat.toPrecision(7),
                longitude: location.lng.toPrecision(7)
            })
        }
        setOnMap(false);
    }

    const select_on_map = (event) => {
        event.preventDefault();
        if(event.target.id == 'src-bt'){
            setMutex(1);
        }
        else{
            setMutex(2);
        }
        setOnMap(true);
    };

    const close_map = (event) => {
        event.preventDefault();
        setOnMap(false);
    };

    async function getAccountNumber () {
        const web3 = new Web3(window.web3.currentProvider);
        var account = await web3.eth.getAccounts()
        return account[0];
    }

    async function processDriverOffer(offer){
        let rootDriverOfferHash = await contract.methods.getRootDriverOfferHash().call();

          try {
              let url = `https://ridechaingateway.infura-ipfs.io/ipfs/${rootDriverOfferHash}`
              const driversOffer = await fetch(url);
              const driversOfferJson = await driversOffer.text();
              let driversOfferObj = JSON.parse(driversOfferJson)

              let driverHash = window.localStorage.getItem('userIpfsHash')

              driversOfferObj[driverHash]= offer

              let newDriverOfferHash = await ipfs.add(JSON.stringify(driversOfferObj))

              var account_no = await getAccountNumber();
              await contract.methods.setRootDriverOfferHash(newDriverOfferHash.path).send({from: account_no})
            } catch (error) {
              console.log('Error saving Driver Offer: ', error)
            } 
      }
      
    var ws = new WebSocket("ws://localhost:8000/ws/"+window.localStorage.getItem('userIpfsHash')+'/');
    useEffect(() => {
    ws.onmessage =function (event) {
        let req = JSON.parse(event.data).message.message
      let driverIpfsHash = req.to_ipfs_hash
      if(driverIpfsHash == window.localStorage.getItem("userIpfsHash")){
        try {
          let riderRequest = {
            phone: req.rider_phone,
            name: req.rider_name,
            source: req.source,
            destination: req.destination,
            rider_ipfs_hash: req.rider_ipfs_hash
          }
          let new_req = requests
          new_req.push(riderRequest)
          let str_req = [];
          for (let i = 0; i < new_req.length; i++) {
            str_req.push(JSON.stringify(new_req[i]));
          }
          let str_set = Array.from(new Set(str_req))
            let final_req = [];
          for (let i = 0; i < str_set.length; i++) {
            final_req.push(JSON.parse(str_set[i]));
          }
          setRequests(final_req);
        } catch (error) {
          console.log('Error getting rider request: ', error)
          return null
        }
      }
    }
},[]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        await processDriverOffer({
            car_number: carNumber,
            car_model: carModel,
            source: source,
            destination: destination,
            car_seats: carSeats,
            free_car_seats: freeSeats,
            fare_per_km: fare
        })

        setSubmitted(true);
        setIsLoading(false)
    };

    async function acceptRider(rider) {
        let driverIpfsHash = window.localStorage.getItem('userIpfsHash');
        let url = `https://ridechaingateway.infura-ipfs.io/ipfs/${driverIpfsHash}`
        const driverInfo = await fetch(url);
        const driverInfoJson = await driverInfo.text();
        let driverInfoObj = JSON.parse(driverInfoJson)

        var rootDriverOfferHash = await contract.methods.getRootDriverOfferHash().call();
        let url2 = `https://ridechaingateway.infura-ipfs.io/ipfs/${rootDriverOfferHash}`
        const driversOffer = await fetch(url2);
        const driversOfferJson = await driversOffer.text();
        let driversOfferObj = JSON.parse(driversOfferJson)

        let driverOffer = driversOfferObj[driverIpfsHash]

        let data = {
            'driver_name': driverInfoObj.username,
            'driver_phone': driverInfoObj.phone,
            'car_model': driverOffer.car_model,
            'car_number': driverOffer.car_number,
            'fare': driverOffer.fare,
            'to_ipfs_hash': rider.rider_ipfs_hash,
        }

        ws.send(JSON.stringify(data))
        setIsConfirmed(true)
        setSelectedRider({
            name: rider.name,
            source: rider.source,
            destination: rider.destination,
            phone: rider.phone
        })
    }

    const PickerBox = (
        <div className='picker-box'>
            <Button variant="info" onClick={handleResetLocation}>Reset Location</Button>
            <Button variant="danger" style={{right:"0%", position:"absolute"}} onClick={close_map}>Close</Button>

            <MapPicker defaultLocation={defaultLocation}
                zoom={zoom}
                mapTypeId="roadmap"
                style={{height:'80%', position: 'relative'}}
                onChangeLocation={handleChangeLocation} 
                onChangeZoom={handleChangeZoom}
                apiKey='AIzaSyDGisCn83lFHHrpOK2894XzWVBPcgpCbJo'/>
             <label>Latitute:</label><input type='text' value={location.lat} disabled/>
            <label>Longitute:</label><input type='text' value={location.lng} disabled/>
            <Button variant="success" style={{right:"0%", position:"absolute"}} onClick={handleSetLocation}>Done</Button>
        </div>
    );

    const make_request_box = (riders)=>{
        let rows = [];
        for(let i = 0; i < riders.length; i++){
            rows.push(
                <Row>
                    <Card className='request-body'>
                        <Card.Body>
                            {riders[i].name} is requesting a ride from {riders[i].source.latitude},{riders[i].source.longitude}
                            to {riders[i].destination.latitude},{riders[i].destination.longitude}
                            <Button style={{position:"absolute", right:"0"}} variant="success" onClick={()=>{acceptRider(riders[i])}}>Accept</Button>
                        </Card.Body>
                    </Card>
                </Row>
            );
        }
        return rows;
    }

    const success = (
        <div className='success-page'>
            <h1>Ride Confirmed ✅</h1>
            <br/>
            <Card className='dark'>
                <Card.Body>
                    <Card.Text>
                        Rider Name: {selectedRider.name}
                    </Card.Text>
                    {selectedRider.source && selectedRider.destination &&
                    <>
                    <Card.Text>
                        Source: {selectedRider.source.latitude}, {selectedRider.source.longitude}
                    </Card.Text>
                    <Card.Text>
                        Destination: {selectedRider.destination.latitude}, {selectedRider.destination.longitude}
                    </Card.Text>
                    </>}
                    <Card.Text>
                        Phone Number: {selectedRider.phone}
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );

    const RequestsBox = (
        <div className='requests-wrapper'>
        <h1 class="offerHeader">Offer Submitted ✅</h1>
        <br/>
        <Card className='dark'>
            <Card.Body>
                <Card.Title>Car Number: {carNumber}</Card.Title>
                <Card.Text>
                    Car Model: {carModel}
                </Card.Text>
                { source != null && destination != null &&
                <>
                <Card.Text>
                    Source: {source.latitude}, {source.longitude}
                </Card.Text>
                <Card.Text>
                    Destination: {destination.latitude}, {destination.longitude}
                </Card.Text>
                </>}
            </Card.Body>
        </Card>
        <h3 className='requests-header'>Requests</h3>
        <div className='requests-box'>
            <Container>
                <Col>
                    {requests.length == 0 ? <h5>Waiting for requests . . .</h5> : make_request_box(requests)}
                </Col>
            </Container>
        </div>
        </div>
    );

    return (
        <>
        {isLoading ? <LoadingScreen msg="Processing Offer"/> : null}
        <Sidebar/>
        <div className="form">
        {!submittted ?
            <Container>
                <Row>
                    <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Car Number</Form.Label>
                        <Form.Control onChange={(e) => {setCarNumber(e.target.value)}} type="text" placeholder="Enter Car Number" name="carnum" required/>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Car Model</Form.Label>
                        <Form.Control onChange={(e) => {setCarModel(e.target.value)}} type="text" placeholder="Enter Car Model" name="carmod" required/>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Seats</Form.Label>
                        <Form.Control onChange={(e) => {setCarSeats(e.target.value)}} type="number" placeholder="Enter Number of seats" name="carseat" required/>
                    </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Number of free seats</Form.Label>
                        <Form.Control onChange={(e) => {setFreeSeats(e.target.value)}} type="number" placeholder="Number of  free seats" name="carfree" required/>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group className="mb-3">
                        <Form.Label>Fare per km</Form.Label>
                        <Form.Control onChange={(e) => {setFare(e.target.value)}} type="number" placeholder="Fare per km" name="carfare" required/>
                    </Form.Group>
                    </Col>
                    <Col>
                        <button id = "src-bt" className='map-bt' onClick={select_on_map}>Select source {source ?"✅":null}</button>
                    </Col>
                    <Col>
                        <button id="dest-bt" className='map-bt' onClick={select_on_map}>Select destination {destination ?"✅":null}</button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Button variant="primary" type="submit" style={{marginTop:"80px"}} onClick={handleSubmit}>
                        Submit
                    </Button>
                    </Col>
                </Row>
            </Container>    
            : isConfirmed?
            success:
            RequestsBox
            }            
        </div>
                {onmap ? PickerBox : null}
        </>
    );
}

export default RideSharer;