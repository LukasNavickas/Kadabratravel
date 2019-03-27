import { Meteor } from 'meteor/meteor';
import { Rates } from '../../api/tasks/rates';

// Modules:
var fx = require('money'),
	  oxr = require('open-exchange-rates');

// Set App ID (required):
oxr.set({
	app_id: 'd9eea5487d924a5db26b41ac4c65df01'
});

const getAllRates = () => {
  try {
    // Get latest exchange rates from API; pass to callback function when loaded:
    oxr.latest(function(error) {

      if ( error ) {
        // `error` will contain debug info if something went wrong:
        console.log( 'ERROR loading data from Open Exchange Rates API! Error was:' )
        console.log( error.toString() );

        // Fall back to hard-coded rates if there was an error (see readme)
        return false;
      }

      // Rates are now stored in `oxr` object as `oxr.rates` - enjoy!
      // Examples to follow:

      // The timestamp (published time) of the rates is in `oxr.timestamp`:
      console.log( 'Exchange rates published: ' + (new Date(oxr.timestamp)).toUTCString() );

      // Each currency is a property in the object/hash, e.g:

      // console.log( 'USD -> AED: ' + oxr.rates.AED );
      // console.log( 'USD -> HKD: ' + oxr.rates['HKD'] );

      fx.rates = oxr.rates;
      fx.base = oxr.base;

      // To load rates into the money.js (fx) library for easier currency
      // conversion, simply apply the rates and base currency like so:
      var newObj = {};
      newObj.rates = oxr.rates;
      newObj.base = oxr.base;

      var amount = fx(10).from('EUR').to('GBP').toFixed(2);
        console.log( '10 EUR in GBP: ' + amount );

      console.log('PALAUKIT PALAUKIT');
      // if (AllRates != null) {
      //   Rates.insert({rates:AllRates, base:AllBase});
      //   module.resolve('done saving exchange rates');
      // }
      if (newObj.rates != null && newObj.base != null) {
        console.log(newObj.base);
        module.resolve(newObj);
      }
      


      

      // Session.set('OxrRates', oxr.rates); 
      // Session.set('OxrBase', oxr.base); 

    

      // money.js is now initialised with the exchange rates, so this will work:
      // var amount = fx(10).from('EUR').to('GBP').toFixed(2);
      // console.log( '10 EUR in GBP: ' + amount );
  
      // module.resolve(oxr);

    });   
    // if (usersContacted === tasksByUser.length) module.resolve(`Tasks sent for ${isoTimestamp()}!`);

  } catch (exception) {
    module.reject(`[getAllRates] ${exception}`);
  }
};

const handler = (options, promise) => {
  try {
    module = promise;
    getAllRates();
    
  } catch (exception) {
    module.reject(`[getRates.handler] ${exception}`);
  }
};


export const getRates = (options) =>
new Promise((resolve, reject) =>
handler(options, { resolve, reject }));