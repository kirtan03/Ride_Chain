import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import { Container, Card } from 'react-bootstrap';
import "./profile.css";
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {

  const { ipfsHash } = useParams();
  const [user,setUser] = React.useState(null)
  const [isUserFetched, setIsUserFetched] = React.useState(false)

  useEffect(()=>{
    const getUser = async ()=> {
    try {
    let url = `https://ridechaingateway.infura-ipfs.io/ipfs/${ipfsHash}`
    const userData = await fetch(url);
    const userDataJson = await userData.text();
    setUser(JSON.parse(userDataJson))
    setIsUserFetched(true)
  } catch (error) {
    console.log('Error getting user data: ', error)
  }
}
getUser()

},[ipfsHash])

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

  return (
    <div className='parentDiv'>
      <Sidebar/>
      {isUserFetched &&
      
        <Container className="mycontainer">
          <Card className="mycard">
            <Card.Img className="myimg" variant="top" src="https://png.pngtree.com/element_our/png/20181206/users-vector-icon-png_260862.jpg" style={{height: "200px", width: "200px"}}/>
            <Card.Body>
              <div className='info'>
              <Card.Text style={{fontSize: "30px"}}><b>{user.username}</b></Card.Text>
              <Card.Text style={{fontSize: "20px"}}>
                <b>City: </b>{user.city}
              </Card.Text>
              <Card.Text style={{fontSize: "20px"}}>
                <b>Phone Number: </b>{user.phone}
              </Card.Text>
              </div>
            </Card.Body>
          </Card>
      </Container>}
    </div>
  );
};

export default UserProfile;