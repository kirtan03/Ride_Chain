import logo from './logo.svg';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import './App.css';
import ipfs from './Web3 Handler/ipfs'


// import Login from './Pages/login';
import Home from './Pages/home';
import Signup from './Pages/signup';
import UserProfile from './Pages/profile';
import Login from './Pages/web3_login';
import RideReceiver from './Pages/ride_receiver';
import RideSharer from './Pages/ride_sharer';
import ContactUs from './Pages/contactus';
import Services from './Pages/Services';
function App() {

  // const handleSubmit = async() => {
  //   let hashes={
  //           source: {latitude: 29.86639467184675, longitude: 77.8674085510241},
  //           destination: {latitude: 29.840935877260474, longitude: 77.91101054077019}
  //     }
  //   let data = {
  //     'QmPBoyRCjmWp9SDjAdQ4EhetLBsMABNx9f1wtCT2iyV1ws': hashes
  //   }
  //   let res =await ipfs.add(JSON.stringify(data));
  //   console.log(res.path)
  //   let url = `https://ridechaingateway.infura-ipfs.io/ipfs/${res.path}`
  //             const driversOffer = await fetch(url);
  //             const driversOfferJson = await driversOffer.text();
  //             let driversOfferObj = JSON.parse(driversOfferJson)
  //             console.log(driversOfferObj)
  // }

  // handleSubmit()
  return (
    <>
      <Router>
        <Routes>
          {/* This route is for home component
          with exact path "/", in component props
          we passes the imported component*/}
          <Route exact path="/" element={<Home/>} />

          {/* This route is for login component
          with exact path "/login", in component
          props we passes the imported component*/}
          {/* <Route path="/login" element={<Login/>} /> */}
          <Route exact path ="/profile/:ipfsHash" element={<UserProfile/>} />
          {/* This route is for signup component
          with exact path "/signup", in
          component props we passes the imported component*/}
          <Route path="/signup" element={<Signup/>} />

           {/* This route is for signup component
          with exact path "/signup", in 
          component props we passes the imported component*/}
          <Route path="/ride_receiver" element={<RideReceiver/>} />

          <Route path="/ride_sharer" element={<RideSharer/>} />

          {/* If any route mismatches the upper
          route endpoints then, redirect triggers
          and redirects app to home component with to="/" */}

          <Route path="/web3_login" element={<Login/>} />
          <Route path="/contactus" element={<ContactUs/>} />
          <Route path="/Services" element={<Services/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
