import React, { Component } from 'react';
import Accounts from '../accounts.js';
import { Link, browserHistory } from 'react-router';

class FirstCarousel extends Component {

  render() {
    return (
      <div className="carouselTravel">
        <div id="myCarousel" className="carousel slide" data-ride="carousel">

          <div className="carousel-inner" role="listbox">
            <div className="item active">
             <a href="#">
              <div className="container without_bottom_padding">
                <div className="row">
                  <div className="col-lg-4">
                    <h3 className="makeCenter">Permalink to RTW solution to visit Singapore, Kuala Lumpur, Tokyo, Hawaii & New York for €972!</h3>
                  </div>

                  <div className="col-lg-8">
                    <img src="http://www.louisetzeliemartin.org/medias/images/chat.jpg" className="img-circle carouselImage" alt="Cat" /> 
                  </div>
                </div>
              </div> 
             </a>
            </div>
          </div>

          <a className="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
            <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="right carousel-control" href="#myCarousel" role="button" data-slide="next">
            <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
      </div>
    );
  }
}

export default FirstCarousel;