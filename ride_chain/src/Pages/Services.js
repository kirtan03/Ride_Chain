import React from 'react';
import { Container, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faGithub} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import './Services.css';
import { Link } from 'react-router-dom';
import Sidebar from '../components/sidebar';


function Services() {
    const message = "We are a syndicate of tech-enthusiasts striving to swirl a typhoon of blockchain-enabled tech in the Indian Market. This techno-savvy 21st century calls for a paradigm shift in security, anonymity and ease-of-access. At RideChain, we build the future...Peace out!!!";
    return (
    <div>
    <Sidebar/>
    <section className="section-bg">
    <div className="container">
    <div className="row">
    <div className="col-md-12 text-center">
    <Card className="my-box2"><Card.Header>
    <h2 className="section-title">
        Meet the team behind RideChain...
    </h2></Card.Header>
    <Card.Body><p className="section-subtitle">{message}</p></Card.Body></Card>
    </div>
    &nbsp;
    &nbsp;
    &nbsp;
    &nbsp;
    <div className="container">
    <div className="my-box">
    <div className="col-sm-8 col-md-10">
    <div className="team-item">
        <h3>TANMAY BAKSHI </h3>
        <div className="team-info"></div>
        <p style={{fontStyle:"italic"}}>I put the 'dev' in 'devastatingly handsome.</p>
        <p>The force is strong with this one! Tanmay loves gaming, music, and has a taste for story-writing.</p>
        <ul className="team-icon">
        <li><a href="mailto:t_bakshi@cs.iitr.ac.in" className="gmail">
        <FontAwesomeIcon icon={faEnvelope} />
        </a></li>
        <li><a href="https://github.com/DarthRevan07" className="github">
        <FontAwesomeIcon icon={faGithub} />
        </a></li>
        </ul>
        </div>
        </div>
        </div>


    <div className="my-box">
<div className="col-sm-6 col-md-10">
    <div className="team-item">
        <h3>MUDIT GUPTA</h3>
        <div className="team-info"></div>
        <p style={{fontStyle:"italic"}}>I speak fluent code.</p>
        <p>A whiz-kid who won't shy away from a challenge! Mudit drinks challenge-soup for breakfast...</p>

        <ul className="team-icon">
        <li><a href="mailto:m_gupta@cs.iitr.ac.in" className="gmail">
        <FontAwesomeIcon icon={faEnvelope} />
        </a></li>
        <li><a href="https://github.com/Magnesium12" className="github">
        <FontAwesomeIcon icon={faGithub} />
        </a></li>
        </ul>
        </div>
        </div>
        </div>


    <div className="my-box">
<div className="col-sm-6 col-md-10">
    <div className="team-item">
        <h3>ASHUTOSH KUMAR</h3>
        <div className="team-info"></div>
        <p style={{fontStyle:"italic"}}>If at first you don't succeed, call it version 1.0.</p>
        <p>A total unmitigated hunk, Ashutosh has figured out to the secret to a sustaining college life.</p>

        <ul className="team-icon">
        <li><a href="mailto:a_kumar1@cs.iitr.ac.in" className="gmail">
        <FontAwesomeIcon icon={faEnvelope} />
        </a></li>
        <li><a href="https://github.com/ashutoshkr129" className="github">
        <FontAwesomeIcon icon={faGithub} />
        </a></li>
        </ul>
        </div>
        </div>
        </div>


    <div className="my-box">
<div className="col-sm-6 col-md-10">
    <div className="team-item">
        <h3>RISHI KEJRIWAL</h3>
        <div className="team-info"></div>
        <p style={{fontStyle:"italic"}}>I turn coffee into code.</p>
        <p>Work-a-holic, musical prodigy, South Asian Maradona, and what not!! </p>

        <ul className="team-icon">
        <li><a href="mailto:r_kejriwal@cs.iitr.ac.in" className="gmail">
        <FontAwesomeIcon icon={faEnvelope} />
        </a></li>
        <li><a href="https://github.com/Kej-r03" className="github">
        <FontAwesomeIcon icon={faGithub} />
        </a></li>
        </ul>
        </div>
        </div>
        </div>


    <div className="my-box">
<div className="col-sm-6 col-md-10">
    <div className="team-item">
        <h3>KIRTAN PATEL</h3>
        <div className="team-info"></div>
        <p style={{fontStyle:"italic"}}>There's no place like 127.0.0.1.</p>
        <p>Should've tried his shot at the stand-up club... the MVP!</p>

        <ul className="team-icon">
        <li><a href="mailto:k_vpatel@cs.iitr.ac.in" className="gmail">
        <FontAwesomeIcon icon={faEnvelope} />
        </a></li>
        <li><a href="https://github.com/kirtan03" className="github">
        <FontAwesomeIcon icon={faGithub} />
        </a></li>
        </ul>
        </div>
        </div>
        </div>

    <div className="my-box">
<div className="col-sm-6 col-md-10">
    <div className="team-item">
        <h3>ASHUTOSH PISE</h3>
        <div className="team-info"></div>
        <p style={{fontStyle:"italic"}}>I have a love-hate relationship with my code. Mostly hate.</p>
        <p>The most extroverted introvert. Effortlessly funny with a contagious laugh!</p>

        <ul className="team-icon">
        <li><a href="mailto:p_akalidas@cs.iitr.ac.in" className="gmail">
        <FontAwesomeIcon icon={faEnvelope} />
        </a></li>
        <li><a href="https://github.com/i-love-chess" className="github">
        <FontAwesomeIcon icon={faGithub} />
        </a></li>
        </ul>
        </div>
        </div>
        </div>

    </div>
    </div>
    </div>
    </section>
    </div>
    )
    }
export default Services