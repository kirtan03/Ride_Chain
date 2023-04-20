import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';
import './contactus.css';
import Sidebar from '../components/sidebar';

const ContactUs = () => {
    const contactConfig = {
        YOUR_EMAIL: 't_bakshi@cs.iitr.ac.in',
        YOUR_PHONE: '9805556376',
        description: 'AF-17, Ganga Bhawan, IIT-R',
        YOUR_SERVICE_ID: 'service_id',
        YOUR_TEMPLATE_ID: 'template_id',
        YOUR_USER_ID: 'user_id',
    };

    return (
        <div className = "mainBody">
            <Sidebar />
            <Container>
                <Row><h1>CONTACT US</h1></Row>
                <Row>
                    <Col className = "firstCol">
                        <h3>GET IN TOUCH</h3>
                        <address>
                            <strong>Email:</strong>{" "}
                            <a href={`mailto:${contactConfig.YOUR_EMAIL}`}>
                                {contactConfig.YOUR_EMAIL}
                            </a>
                            <br />
                            <br />
                            {contactConfig.hasOwnProperty("YOUR_PHONE") ? (
                                <p>
                                    <strong>Phone:</strong> {contactConfig.YOUR_PHONE}
                                </p>
                            ) : (
                                ""
                            )}
                            <br />
                        </address>
                        <strong>Address:</strong>{" "}
                        <p>{contactConfig.description}</p>
                    </Col>
                    <Col>
                        <Card className="secondCol">
                            <Card.Header><b> Your Details : </b></Card.Header>
                            <Card.Body>
                                <Form.Group>
                                    <Form.Control type="text" className='myname' placeholder="Enter Name" name="name" required/>
                                    <br/>
                                    <Form.Control type="email" className='myemail' placeholder="Enter E-mail Address" name="email" required/>
                                    <br/>
                                    <Form.Control type="text" className='mymessage' placeholder="Enter Message" name="message" as="textarea" rows = {3} required/>
                                    <br/>
                                    <Button>
                                        Send
                                    </Button>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );

}

export default ContactUs;