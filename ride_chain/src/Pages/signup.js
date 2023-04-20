import React, { useState } from 'react';
import { Button, Form, Toast } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "./signup.css";
import "../Web3 Handler/auth"
import Web3 from 'web3';
import { sign_up } from '../Web3 Handler/auth';
import LoadingScreen from './loading';

function Signup() {
    const [errorMessages, setErrorMessages] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [name, setName] = useState("");
    const [phonenum, setPhonenum] = useState("");
    const [city, setCity] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true)
        let userData = {
            'username': name,
            'phone': phonenum,
            'city': city
        }
        const web3 = new Web3(window.web3.currentProvider);
        let account = await web3.eth.getAccounts()

        await sign_up(account[0], userData)

        setIsLoading(false)
    };

    // Generate JSX code for error message
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
        <div className="error">{errorMessages.message}</div>
        );

    // JSX code for login form
    const renderForm = (
        <div className="signup-form">
            {isLoading ? <LoadingScreen msg="Signing You Up" /> : null}
            <p>Sign Up</p>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" className='form-text' placeholder="Enter Name" name="name" onChange={e=>{setName(e.target.value)}} required/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text" className='form-text' placeholder="Enter Phone Number" name="phonenum" onChange={e=>{setPhonenum(e.target.value)}} required/>
                {renderErrorMessage("phonenum")}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" className='form-text' placeholder="Enter City" name="name" onChange={e=>{setCity(e.target.value)}} required/>
            </Form.Group>
            <button className = "my-button" onClick={handleSubmit}>
                Register
            </button>
        </div>
    );

    return (
        <>
        <div className="signup">
            {isSubmitted ?
            <Toast className="my-toast">
                <Toast.Body>User has successfully registered.</Toast.Body>
            </Toast> : renderForm}
        </div>
        </>
    );
}

export default Signup;