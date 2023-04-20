import {useState, useEffect} from 'react';
import Web3 from 'web3';
import sign_in from '../Web3 Handler/auth'
import { Alert } from 'react-bootstrap';

import './web3_login.css';
function Login() {

  const [isConnected, setIsConnected] = useState(false);
  const [ethAvailable, setEthAvailable] = useState(true);

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      setEthAvailable(false);
      console.log("Non-ethereum browser detected. You should install Metamask");
    }
    return provider;
  };

  const onConnect = async() => {
    try {
      const currentProvider = detectCurrentProvider();
      if(currentProvider) {
        await currentProvider.request({method: 'eth_requestAccounts'});
        const web3 = new Web3(currentProvider);
        const userAccount  =await web3.eth.getAccounts();
        const account = userAccount[0];
        console.log("ethAccountNumber", account);
        await sign_in(account);
        setIsConnected(true);
      }
    } catch(err) {
      console.log(err);
    }
  }

  const onDisconnect = () => {
    setIsConnected(false);
  }

  return (
    <div className='parentDiv'>
    <div className="login">
      <div className="login-header">
        <h1 style={{color:"orange", fontFamily:"serif"}}>Please allow access to your Metamask account</h1>
      </div>
      <div className="login-wrapper">
        {!isConnected && (
          <div>
            <button className="login-bt" onClick={onConnect}>
                Login
            </button>
          </div>
        )}
      </div>
      {!ethAvailable && (
        <Alert variant='danger' onClose={()=>{setEthAvailable(true)}} dismissible>
          <Alert.Heading>Non-ethereum browser detected. You should install Metamask</Alert.Heading>
        </Alert>
      )
    }
      {/* {isConnected && (
        <div className="login-wrapper">
          <div className="login-details">
          <h2> You are connected to metamask.</h2>
          <div className="login-balance">
              <span>Balance: </span>
              {ethBalance}
            </div>
          </div>
          <div>
            <button className="login-buttons__logout" onClick={onDisconnect}>
            Disconnect
            </button>
          </div>
        </div>
      )} */}
    </div>
    </div>
  );
}

export default Login;