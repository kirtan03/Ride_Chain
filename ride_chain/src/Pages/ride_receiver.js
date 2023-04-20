import React, { useState,useEffect } from 'react';
import { Button, Form, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import Web3 from 'web3';
import Sidebar from '../components/sidebar';
import LoadingScreen from './loading';
import ipfs from '../Web3 Handler/ipfs'
import contract from '../Web3 Handler/contract'
import MapPicker from 'react-google-map-picker'
import { useNavigate } from 'react-router-dom';

import './ride_receiver.css';
const DefaultLocation = { lat: 29.86758323934143, lng: 77.89498881574703};
const DefaultZoom = 13;

function RideReceiver(props){
    
    const [source, setSource] = useState();
    const [destination, setDestination] = useState();
    const [isLoading, setIsLoading] = useState(false);
    
    const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);

    const [location, setLocation] = useState(defaultLocation);
    const [zoom, setZoom] = useState(DefaultZoom);
    const [onmap, setOnMap] = useState(false);
    const [mutex, setMutex] = useState(1);
    const[suggestions, setSuggestions] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [selectedDriver,setSelectedDriver] = useState({});

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

    function distance(source, destination){
        return Math.sqrt(Math.pow((source.longitude - destination.longitude),2)+Math.pow((source.latitude - destination.latitude),2));
    }

    async function matchDriver(req, driverOffersObj) {
        let suitableDrivers = []
        let distances = []
        let driverHashes = Object.keys(driverOffersObj)
        for(let i=0;i<driverHashes.length;i++){
            let driverHash = driverHashes[i]
            let driverOffer = driverOffersObj[driverHash]
            let driverOfferSource = driverOffer.source
            let driverOfferDestination = driverOffer.destination
            let riderRequestSource = req.source
            let riderRequestDestination = req.destination

            let deviation = distance(driverOfferSource, riderRequestSource) + distance(driverOfferDestination, riderRequestDestination) 
            + distance(riderRequestSource, riderRequestDestination) - distance(driverOfferSource, driverOfferDestination)

            distances.push({driverHash: driverHash, deviation: deviation, driverOffer: driverOffer})
        }
        distances.sort((a,b) => (a.deviation > b.deviation) ? 1 : ((b.deviation > a.deviation) ? -1 : 0))
        for(let i=0;i<Math.min(distances.length,5);i++){
            suitableDrivers.push(distances[i].driverOffer)

            let url = `https://ridechaingateway.infura-ipfs.io/ipfs/${distances[i].driverHash}`
            const driver = await fetch(url);
            const driverJson = await driver.text();
            let driverObj = JSON.parse(driverJson)

            suitableDrivers[i].driver = driverObj
            suitableDrivers[i].driverHash = distances[i].driverHash
        }
        return suitableDrivers
    }

    async function getAccountNumber () {
        const web3 = new Web3(window.web3.currentProvider);
        var account = await web3.eth.getAccounts()
        return account[0];
    }

    async function processRiderRequest(req){
        var rootRiderRequestHash = await contract.methods.getRootRiderRequestHash().call()
          try {
              let url = `https://ridechaingateway.infura-ipfs.io/ipfs/${rootRiderRequestHash}`
              const ridersRequest = await fetch(url);
              const ridersRequestJson = await ridersRequest.text();
              let ridersRequestObj = JSON.parse(ridersRequestJson)

              let riderHash = window.localStorage.getItem('userIpfsHash')
              ridersRequestObj[riderHash]= req
              let newRiderRequestHash = await ipfs.add(JSON.stringify(ridersRequestObj))
              
              var account_no = await getAccountNumber()
              await contract.methods.setRootRiderRequestHash(newRiderRequestHash.path).send({from: account_no})
            } catch (error) {
              console.log('Error getting rider request: ', error)
              return null
            } 
          
            var rootDriverOfferHash = await contract.methods.getRootDriverOfferHash().call()

            let url = `https://ridechaingateway.infura-ipfs.io/ipfs/${rootDriverOfferHash}`
            const driverOffers = await fetch(url);
            const driverOffersJson = await driverOffers.text();
            let driverOffersObj = JSON.parse(driverOffersJson)
      
            let suitableDrivers= [];
            await matchDriver(req,driverOffersObj).then((res)=>{suitableDrivers = res})
            return suitableDrivers
      }
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        let driversList = await processRiderRequest({
            source: source,
            destination: destination
        })

        setSuggestions(current=> driversList);
        setIsSubmitted(true);
        setIsLoading(false)
    };
    
    const displayDrivers = (suitableDrivers)=>{
        console.log(Promise.resolve(suitableDrivers))
        let display =[];
        for (let i = 0; i < suitableDrivers.length; i++) {
            display.push(
                <Row>
                    <Card className='result-body'>
                        <Card.Title>{suitableDrivers[i].driver.username}</Card.Title>
                        <Card.Body>
                            {suitableDrivers[i].car_model}, {suitableDrivers[i].fare_per_km}
                            <Button style={{position:"absolute", right:"0"}} variant="success" onClick={()=>{confirmDriver(suitableDrivers[i].driverHash)}}>Request</Button>
                        </Card.Body>
                    </Card>
                </Row>
            )
        }
        return display;
    }

    const suitableDriversBox = (
        <div className='results-wrapper'>
            <h3 className="results-header">Suitable Drivers</h3>
            <div className="results-box">
                <Container>
                    <Col>
                        {suggestions.length == 0 ? <h5>No Suitable Drivers</h5> : displayDrivers(suggestions)}
                    </Col>
                </Container>
            </div>
        </div>
    );


    const successPage = (
        <div className='success-page'>
            <h1>Ride Confirmed ✅</h1>
            <br/>
            <Card className='dark'>
                <Card.Body>
                    <Card.Title>Car Number: {selectedDriver.carNumber}</Card.Title>
                    <Card.Text>
                        Owner Name: {selectedDriver.name}
                    </Card.Text>
                    <Card.Text>
                        Car Model: {selectedDriver.carModel}
                    </Card.Text>
                    <Card.Text>
                        Phone Number: {selectedDriver.phoneNum}
                    </Card.Text>
                    <Card.Text>
                        Fare: 40
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    );

    var ws = new WebSocket("ws://localhost:8000/ws/"+window.localStorage.getItem('userIpfsHash')+'/');
    ws.onmessage = async function (event) {
    let req = JSON.parse(event.data).message.message
    let riderIpfsHash = req.to_ipfs_hash

    if(riderIpfsHash == window.localStorage.getItem("userIpfsHash")){        
        setSelectedDriver({
            fare: req.fare,
            name: req.driver_name,
            phoneNum: req.driver_phone,
            carNumber: req.car_number,
            carModel: req.car_model
        })
        setIsConfirmed(true)
    }
    }

    async function confirmDriver(driverIpfsHash){
        // send confirmation prompt to driver
        let riderIpfsHash = window.localStorage.getItem("userIpfsHash");
        let url = `https://ridechaingateway.infura-ipfs.io/ipfs/${riderIpfsHash}`
        const riderInfo = await fetch(url);
        const riderInfoJson = await riderInfo.text();
        let riderInfoObj = JSON.parse(riderInfoJson)
        let data = {
            'rider_name': riderInfoObj.username,
            'rider_phone': riderInfoObj.phone,
            'source': source,
            'destination': destination,
            'to_ipfs_hash': driverIpfsHash,
            'rider_ipfs_hash': riderIpfsHash,
        }
        ws.send(JSON.stringify(data));
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

    return (
        <>
        {isLoading? <LoadingScreen msg="Finding Driver"/>:null}
            <Sidebar/>
            <div className="form">
            {!isConfirmed ?
                <Container>
                    <Row>
                        <Col>
                        <button id = "src-bt" className='map-bt' onClick={select_on_map}>Select source {source ?"✅":null}</button>
                        </Col>
                        <Col>
                        <button id="dest-bt" className='map-bt' onClick={select_on_map}>Select destination {destination ?"✅":null}</button>
                        </Col>
                        <Col>
                            <Button variant="primary" type="submit" style={{marginTop:"25px"}} onClick={handleSubmit}>
                                Find
                            </Button>
                        </Col>
                    </Row>
                    { isSubmitted? suitableDriversBox: null}
                </Container>
                : successPage
            }
        </div>
            {onmap ? PickerBox : null}
            </>
    );
}

export default RideReceiver;