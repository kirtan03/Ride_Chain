import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import './loading.css';
function LoadingScreen(props) {
  let msg = props.msg
  const [loadingVariant, setLoadingVariant] = useState('primary');


  return (
    <div className="loading-screen d-flex flex-column align-items-center justify-content-center">
      <Spinner animation="border" variant="light" className="dotted-spinner" />
      <Alert variant="light" className="mt-3">{msg}...</Alert>
    </div>
  );
}

export default LoadingScreen;