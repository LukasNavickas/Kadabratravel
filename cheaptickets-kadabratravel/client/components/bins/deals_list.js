import React, { Component } from 'react';
import Accounts from '../accounts.js';
import { Link, browserHistory } from 'react-router';

class DealsList extends Component {

  render() {
    return (
      <div className="container-fluid containerPadding cards-row">
        <div className="row">

          <div className="col-lg-3 text-center">
            <h2>Filter:</h2>
            {/*Filter: My budget, 100 and under, 200 and under, like in Ryanair            */}
            {/*<div className="btn-group" role="group" aria-label="...">
              <button type="button" className="btn btn-default">50€ and under</button> <br />
              <button type="button" className="btn btn-default">Middle</button>
              <button type="button" className="btn btn-default">Right</button>
            </div>*/}
            
          </div>

          <div className="col-lg-8">
            <div className="row">
                
              <div className="col-md-4">
                <a href="#">
                  <div className="thumbnail">
                  
                    <div className="imageProp">
                      <div className="caption readMore">SHOW DEAL <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></div>
                      <img src="https://1.bp.blogspot.com/-aFQ-W_KTFWQ/V6BdtpSUy6I/AAAAAAAAAH4/xD_U-BYItSsNvk1UGfROqLBzzU1h32oXQCLcB/s320/4-diwali-greeting-cards-by-ajay-acharya.jpg" alt="Bootstrap Thumbnail Customization" />
                    </div>
                    
                    <div className="caption">
                      <h4>The Shorthaul – jetBlue – $136: Newark – Orlando (and vice versa). Roundtrip, including all Taxes</h4>
                      {/*<p className="card-description"><strong>Bootstrap Thumbnail</strong> Customization Example. Here are customized <strong>bootstrap cards</strong>. We just apply some box shadow and remove border radius.</p>
                      <p><a href="#" className="btn btn-primary" role="button">Button</a></p>*/}
                    </div>
                
                  </div>
                </a>
              </div>

              <div className="col-md-4">
                <a href="#">
                  <div className="thumbnail">
                  
                    <div className="imageProp">
                      <div className="caption readMore">SHOW DEAL <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></div>
                      <img src="https://1.bp.blogspot.com/-aFQ-W_KTFWQ/V6BdtpSUy6I/AAAAAAAAAH4/xD_U-BYItSsNvk1UGfROqLBzzU1h32oXQCLcB/s320/4-diwali-greeting-cards-by-ajay-acharya.jpg" alt="Bootstrap Thumbnail Customization" />
                    </div>
                    
                    <div className="caption">
                      <h4>The Shorthaul – jetBlue – $136: Newark – Orlando (and vice versa). Roundtrip, including all Taxes</h4>
                      {/*<p className="card-description"><strong>Bootstrap Thumbnail</strong> Customization Example. Here are customized <strong>bootstrap cards</strong>. We just apply some box shadow and remove border radius.</p>
                      <p><a href="#" className="btn btn-primary" role="button">Button</a></p>*/}
                    </div>
                
                  </div>
                </a>
              </div>


              <div className="col-md-4">
                <a href="#">
                  <div className="thumbnail">
                  
                    <div className="imageProp">
                      <div className="caption readMore">SHOW DEAL <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></div>
                      <img src="https://1.bp.blogspot.com/-aFQ-W_KTFWQ/V6BdtpSUy6I/AAAAAAAAAH4/xD_U-BYItSsNvk1UGfROqLBzzU1h32oXQCLcB/s320/4-diwali-greeting-cards-by-ajay-acharya.jpg" alt="Bootstrap Thumbnail Customization" />
                    </div>
                    
                    <div className="caption">
                      <h4>The Shorthaul – jetBlue – $136: Newark – Orlando (and vice versa). Roundtrip, including all Taxes</h4>
                      {/*<p className="card-description"><strong>Bootstrap Thumbnail</strong> Customization Example. Here are customized <strong>bootstrap cards</strong>. We just apply some box shadow and remove border radius.</p>
                      <p><a href="#" className="btn btn-primary" role="button">Button</a></p>*/}
                    </div>
                
                  </div>
                </a>
              </div>



            </div>
          </div>

        </div>
      </div>
    
    );
  }
}

$( document ).ready(function() {

    $(function () {
        $('.mm_tooltip').tooltip({
            selector: "[data-toggle=tooltip]",
            container: "body"
        })
    });
 
    $('.thumbnail').hover(
        function(){
            $(this).find('.readMore').slideDown(300); //.fadeIn(250)
        },
        function(){
            $(this).find('.readMore').slideUp(200); //.fadeOut(205)
        }
    ); 

});

export default DealsList;