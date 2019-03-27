import React, { Component } from 'react';
import Accounts from './accounts';
import { Link, browserHistory } from 'react-router';

class Header extends Component {
  onBinClick(event) {
    event.preventDefault();

    Meteor.call('bins.insert', (error, binId) => {
      browserHistory.push(`/bins/${binId}`);
    });
  }

  render() {
    return (
      <nav className="nav navbar-default"> 
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button> 
          <Link to="/" className="navbar-brand">Lukastravels</Link>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav">
            {/*<li className="active"><a href="#">Link <span className="sr-only">(current)</span></a></li>
            <li><a href="#">Link</a></li>*/}
          </ul>

      {/*<ul className="nav navbar-nav navbar-right">
        <li><a href="#">Link</a></li>
      </ul>*/}

    </div>

        
        
      </nav>
    );
  }
}

export default Header;

{/*<ul className="nav navbar-nav">
          <li>
            <Accounts />
          </li>
          <li>
            <a href="#" onClick={this.onBinClick.bind(this)}>Create Bin</a>
          </li>
        </ul>*/}