import React, { Component } from 'react';
import Accounts from '../accounts.js';
import { Link, browserHistory } from 'react-router';

class FirstDepart extends Component {

  render() {
    return (
      <div className="container-fluid containerPadding">
        <div className="row">

          <div className="col-lg-3 text-center">
            <img src="https://t4.ftcdn.net/jpg/01/05/11/33/240_F_105113384_M3Bk2JQvxuganxCQl2PkNzSMb6ShUuRg.jpg" width="50px" height="50px" alt=""/>
            <h3>YOU TRAVEL <br />FROM</h3>
          </div>

          <div className="col-lg-2 text-center">
            <a href="#"> 
              <img src="icon-usa.png" alt=""/>
              <h3>EUROPE</h3>
            </a>
          </div>

          <div className="col-lg-2 text-center">
            <a href="#"> 
              <img src="icon-usa.png" alt=""/>
              <h3>USA</h3>
            </a>
          </div>

          <div className="col-lg-2 text-center">
            <a href="#"> 
              <img src="icon-asia.png" alt=""/>
              <h3>ASIA</h3>
            </a>
          </div>

          <div className="col-lg-2 text-center">
            <a href="#"> 
              <img src="icon-oceania.png" alt=""/>
              <h3>OCEANIA</h3>
            </a>
          </div>

        </div>
      </div>
    
    );
  }
}

export default FirstDepart;