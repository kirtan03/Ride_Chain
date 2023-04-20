// basic home page
import React from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from 'react-bootstrap';
import './home.css';

function Home() {
    return (
        <div className="Home">
            
            <h1 className='header'>Welcome to RideChain</h1>
            <Button variant="primary" className="login-bt" href="/web3_login"><b>Get Started</b></Button>
        </div>
    );
}

export default Home;
    