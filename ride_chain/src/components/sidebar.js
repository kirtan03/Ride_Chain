import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Button, Container, Row, Col} from 'react-bootstrap';
import './sidebar.css';

function Sidebar({logout_callback}) {
    const [logged, setLogged] = useState(true);
    const logout = () => {
        window.localStorage.removeItem('userIpfsHash');
        setLogged(false);
        //reload
        window.location.reload();
        console.log("logout");
    }
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

    const handleClose = () => document.getElementById("sidebar_content").style.display = "none";
    const handleShow = () => document.getElementById("sidebar_content").style.display = "block";

    const dashboard = () => {
        console.log("dashboard");
    }
    const get_ride = () => {
        console.log("get ride");
    }
    const share_ride = () => {
        console.log("share ride");
    }
    const my_profile = () => {
        window.location.href = "/profile/"+userIpfsHash+"/";
        console.log("my profile");
    }

    if(document.getElementById("sidebar_content")!=null){
        handleClose();
    }
    var userIpfsHash = window.localStorage.getItem('userIpfsHash');

    return (
        <div style={{overflow:"hidden"}} className='sidebar'>
            <div className='sidebar_toggle' id='sidebar_toggle'>
                <Button variant="primary" className="pull-right" onClick={handleShow}>
                    ☰
                </Button>
            </div>
            <div className='sidebar_content' id='sidebar_content'>
                <Button variant="danger" className="pull-left" onClick={handleClose}>
                    X
                </Button>
                <Container>
                    <Col>
                        <Row>
                            <Link to={"../ride_receiver"}>
                                <Button className="sidebar_bt" onClick={get_ride}>
                                    Receive a Ride
                                </Button>
                            </Link>
                        </Row>
                        <Row>
                        <Link to={"../ride_sharer"}>
                            <Button className="sidebar_bt" onClick={share_ride}>
                                Share a Ride
                            </Button>
                        </Link>
                        </Row>
                        <Row>
                        <Link to={"../contactus"}>
                            <Button className="sidebar_bt">
                                Contact Us
                            </Button>
                        </Link>
                        </Row>
                        <Row>
                        <Link to={"../Services"}>
                            <Button className="sidebar_bt">
                                About Us
                            </Button>
                        </Link>
                        </Row>
                        <Row>
                            <Button className="sidebar_bt" onClick={my_profile}>
                                My Profile
                            </Button>
                        </Row>
                        <Row>
                            <Button variant="outline-danger" className="sidebar_bt_logout" onClick={logout}>
                                Logout
                            </Button>
                        </Row>
                    </Col>
                </Container>
            </div>
        </div>
    );
}

export default Sidebar;