/* eslint-disable consistent-return */
import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Links } from '../../api/tasks/tasks';
import { Rates } from '../../api/tasks/rates';
import { isoTimestamp, endOfYesterday, endOfToday } from '../dates';
import { templateToHTML } from './template-to-html';
import { HTTP } from 'meteor/http';
import cheerio from 'cheerio';

var nlp = require('compromise');
const cities = require("cities-list");
const translate = require('google-translate-api');
var fx = require('money')

var API_KEY = '4994155-5e2e0e0eb5b148e84b1d66de6';


let module;

// const sendTasksToUsers = (tasksByUser) => {
//   try {
//     let usersContacted = 0;
//     tasksByUser.forEach(({ firstName, tasks, emailAddress }) => {

//       if (tasks.length > 0) {
//         sendEmail({
//           to: `${firstName} <${emailAddress}>`,
//           html: templateToHTML('daily-tasks-list', { firstName, tasks }),
//           subject: `[TaskWire] Here\'s your agenda for today, ${firstName}.`,
//         });
//       }

//       usersContacted += 1;
      // if (usersContacted === tasksByUser.length) module.resolve(`Tasks sent for ${isoTimestamp()}!`);
//     });
//   } catch (exception) {
//     module.reject(`[sendTasksToUsers] ${exception}`);
//   }
// };

// const getTasks = (owner) => {
//   try {
//     return Tasks.find({
//       owner,
//       completed: false,
//       due: { $gt: endOfYesterday(), $lt: endOfToday() },
//     }, { fields: { title: 1, completed: 1, due: 1, owner: 1 } }).fetch();
//   } catch (exception) {
//     module.reject(`[getTasks] ${exception}`);
//   }
// };

function convertCurrencyInText(text, currency) {
  var travelCost = text.split(' ');
  for(z = 0; z < travelCost.length; z++) {
    if (travelCost[z] == 'PLN' || travelCost[z] == 'PLN.' || travelCost[z] == 'PLN,' || travelCost[z] == 'Kč') {
      var amount = parseInt(travelCost[z-1]);
      var amount2 = fx(amount).from(currency).to('EUR').toFixed(2);
      travelCost[z-1] = amount2 + '€';
      if (travelCost[z] == 'PLN.' || travelCost[z] == 'PLN,') {
        travelCost[z] = '.';
      } else {
        travelCost[z] = '';
      }
    }
  }

  var travelCost2 = travelCost.join(' '); 

  return travelCost2;

}

 function removeDuplicates(arr) {
    var i, ret = [];
    for (i = 0; i < arr.length; i += 1) {          
        if (ret.indexOf(arr[i]) !== -1) {
            ret.splice(ret.indexOf(arr[i]), 1);
        } else {
            ret.push(arr[i]);
        }
    }
    return ret;
}

const sendLinks = (AllLinks) => {
  try {
    for (i = 0; i < AllLinks.length; i++) {
      var travelPlace4 = null;
  
      var sepLink = AllLinks[i].split('/');

      if (AllLinks[i] != undefined && AllLinks[i] != null && sepLink[2] == "www.fly4free.com") {
        var TravelLink = AllLinks[i];

        result = HTTP.get(AllLinks[i], {});
        $ = cheerio.load(result.content);

        var travelTitle = $('.article__title').text();

        var travelDates = $('p').text();
        var travelDates2 = travelDates.substring(0, travelDates.indexOf('Routing'));
        var travelDates3 = travelDates2.split(":").pop(); // Travel Dates

        var travelPlace = nlp(travelTitle).match('to *').out('text').replace('to','').trim().replace(/,/g , "");;
        var travelPlace2 = travelPlace.split(' ');
        var travelPlace3 = travelPlace2[0] + " " + travelPlace2[1];

        // console.log(travelPlace);
        // console.log(TravelLink);

        if (travelPlace != null) {
          if (cities[travelPlace3] == 1) {
            var travelPlace4 = travelPlace3;
          } else {
            var travelPlace4 = travelPlace2[0];
          }
        } else {
          var travelPlace4 = nlp(travelTitle).match('in .').out('text').replace('in','');
        }  

        var travelBuy = $('p:contains("book:")').find('a').attr('href'); // Link to buy

        // console.log(travelBuy)
        // console.log(travelDates3);
        // console.log(travelTitle);

        if (travelDates3 != null && travelTitle != null && travelBuy != null && travelPlace4 != null && TravelLink != null && travelDates3 != '') {
          // var URL = "https://pixabay.com/api/?key="+API_KEY+"&q="+encodeURIComponent(travelPlace4)+"&category=travel";
          // var images = HTTP.get(URL, {});
          
            // if (images) {
              // var imageLink = images.data.hits[0].webformatURL;
                // Links.insert({ title: travelTitle, dates:travelDates3, description:'', image:imageLink, buyLink:travelBuy, link: TravelLink, datetime: new Date() });
            // } else {
                Links.insert({ title: travelTitle, dates:travelDates3, description:'', image:'NO IMAGE', buyLink:travelBuy, link:TravelLink, datetime: new Date() });
            // }    
        }
      } 

      if (AllLinks[i] != undefined && AllLinks[i] != null && sepLink[2] == "www.fly4free.pl") {

        var t2 = {
          travelTitle: null,
          travelTitle2: null,
          travelTitle3: null,
          travelDescription: null,
          travelDescription2: null,
          travelDescription3: null,
          travelBuy: null,
          travelBuy2: null,
        };

        var TravelLink1 = AllLinks[i];
        

        result = HTTP.get(AllLinks[i], {});
        $ = cheerio.load(result.content);

        t2.travelTitle = $('.article__title').text();
        // console.log('title' + travelTitle);
        t2.travelDescription = $('.article__content').find('p').first().text();
        // console.log('desvr' + travelDescription);
        t2.travelBuy = $("img[src$='//www.fly4free.pl/wp-content/uploads/2016/09/lotJm.png']").parent().attr('href'); // Link to buy
        if (t2.travelBuy == null) {
          return 0;
        }
        // console.log('link' + travelBuy);
        t2.travelBuy2 = t2.travelBuy.split('https://').pop().split('http://').pop(); // link ready for DB
        console.log(t2.travelBuy2);

        t2.travelTitle3 = convertCurrencyInText(t2.travelTitle, 'PLN');
        t2.travelDescription3 = convertCurrencyInText(t2.travelDescription, 'PLN');

        translate(t2.travelTitle3, {from: 'pl', to: 'en'}).then(res => {
          t2.travelTitle2 = res.text; // title for DB

          translate(t2.travelDescription3, {from: 'pl', to: 'en'}).then(response => {
            t2.travelDescription2 = response.text; // description for DB
            // console.log('title = ' + t2.travelTitle2);
            // console.log('description = ' + t2.travelDescription2);
            // console.log('linkBuy = ' + t2.travelBuy2);
            // console.log('link = ' + TravelLink1);

            if (t2.travelDescription2 != null && t2.travelTitle2 != null && t2.travelBuy2 != null && TravelLink1 != null) {
                Links.insert({ title: t2.travelTitle2, dates:'', description:t2.travelDescription2, image:'', buyLink:t2.travelBuy2, link: TravelLink1, datetime: new Date() });
            } 

          }).catch(err => {
            console.error(err);
          });

        }).catch(err => {
          console.error(err);
        });

      }


      if (AllLinks[i] != undefined && AllLinks[i] != null && sepLink[2] == "kadetade.com") {
        var TravelLink2 = AllLinks[i];
        var describe2 = '';

        var t3 = {
          travelTitle: null,
          travelTitle2: null,
          travelTitle3: null,
          travelDescription: '',
          travelDescription2: null,
          travelDescription3: null,
          travelDescription4: null,
          travelBuy: null,
          travelBuy2: null,
        };

        result = HTTP.get(AllLinks[i], {});
        $ = cheerio.load(result.content);

        t3.travelTitle = $('h1').text();
        t3.travelDescription = $('strong:contains("►")').text();
        t3.travelBuy = $('a.envor-btn').first().attr('href');
        

        translate(t3.travelTitle, {from: 'sk', to: 'en'}).then(res => {
          t3.travelTitle2 = res.text; // title for DB

          translate(t3.travelDescription, {from: 'sk', to: 'en'}).then(response => {
            t3.travelDescription2 = response.text; // description for DB
            t3.travelDescription3 = t3.travelDescription2.split(' ');
            t3.travelDescription3[0] = '';
            t3.travelDescription4 = t3.travelDescription3.join(' ').replace('►', '. ');

            // console.log('title = ' + t3.travelTitle2);
            // console.log('description = ' + t3.travelDescription4);
            // console.log('linkBuy = ' + t3.travelBuy);
            // console.log('link = ' + TravelLink2);

            if (t3.travelDescription4 != null && t3.travelDescription4 != '' && t3.travelTitle2 != null && TravelLink2 != null && t3.travelBuy != null) {
                Links.insert({ title: t3.travelTitle2, dates:'', description:t3.travelDescription4, image:'', buyLink:t3.travelBuy, link: TravelLink2, datetime: new Date() });
            } 

          }).catch(err => {
            console.error(err);
          });

        }).catch(err => {
          console.error(err);
        });

      }

      if (AllLinks[i] != undefined && AllLinks[i] != null && sepLink[2] == "travelfree.info") {
        var TravelLink3 = AllLinks[i];
        var describe2 = '';

        var t4 = {
          travelTitle: null,
          travelTitle2: null,
          travelTitle3: null,
          travelDates: null,
          travelDates2: null,
          travelDates3: null,
          travelDates4: null,
          travelDescription: '',
          travelDescription2: null,
          travelDescription3: null,
          travelDescription4: null,
          travelBuy: null,
          travelBuy2: null,
          travelBuy3: null,
          travelBuy4: null,
        };

        result = HTTP.get(AllLinks[i], {});
        $ = cheerio.load(result.content);


        t4.travelTitle = $('h2.post-title').text();

        t4.travelBuy = $('div.entry.clearfix').first().html();

        // if (t4.travelBuy) { t4.travelBuy2 = t4.travelBuy.split("(adsbygoogle = window.adsbygoogle || []).push({});")[2]; }
        if (t4.travelBuy) { t4.travelBuy2 = t4.travelBuy.split("Where to").pop().split("<a")[1]; }
        if (t4.travelBuy2) { t4.travelBuy3 = t4.travelBuy2.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, ""); }
        
        
        t4.travelDates = $('div.entry.clearfix').first().text();  
        // .pop() would delete to left 
        if (t4.travelDates) { t4.travelDates2 = t4.travelDates.split("(adsbygoogle = window.adsbygoogle || []).push({});")[2] + t4.travelDates.split("(adsbygoogle = window.adsbygoogle || []).push({});")[3]; }  
        // deletes after Where. Dates and Routes!
        if (t4.travelDates2) { t4.travelDates3 = t4.travelDates2.substring(0, t4.travelDates2.indexOf('Where')).trim(); }

        if (t4.travelDates3 != null && t4.travelDates3 != '' && t4.travelBuy3 != null && TravelLink3 != null && t4.travelTitle != null) {
          Links.insert({ title: t4.travelTitle, dates:t4.travelDates3, description:'', image:'', buyLink:t4.travelBuy3, link: TravelLink3, datetime: new Date() });
        }
      
      }

      if (AllLinks[i] != undefined && AllLinks[i] != null && sepLink[2] == "www.urlaubspiraten.de") {
        var TravelLink4 = AllLinks[i];

        var t5 = {
          travelTitle: null,
          travelTitle2: null,
          travelDates2: null,
          travelDates3: null,
          travelDates4: null,
          travelDescription: '',
          travelDescription2: null,
          travelDescription3: null,
          travelDescription4: null,
          travelDescription5: null,
          travelDescription6: null,
          travelDescription7: null,
          travelBuy: null,
        };

        result = HTTP.get(AllLinks[i], {});
        $ = cheerio.load(result.content);

        t5.travelTitle = $('.sPost-hl').text(); // title (trnaslate)
        t5.travelDescription = $('.offer-subl').text(); // Time (translate)
        t5.travelDescription2 = $('.offer-rt-rd-o > .offer-rt-rd-lo').text(); // departs from cities ... (translate)
        t5.travelDescription3 = $('.offer-rt-rd-d > .offer-rt-rd-lo').text(); // arrives to cities ... (translate)
        t5.travelBuy = $('.offer-book-lnk').first().attr('href'); // linkas

        console.log(t5.travelBuy);

        translate(t5.travelTitle, {from: 'de', to: 'en'}).then(res => {
          t5.travelTitle2 = res.text; // title for DB

          translate(t5.travelDescription, {from: 'de', to: 'en'}).then(response => {
            t5.travelDescription4 = response.text; // description for DB

            translate(t5.travelDescription2, {from: 'de', to: 'en'}).then(response => {
              t5.travelDescription5 = response.text; // description for DB        

              translate(t5.travelDescription3, {from: 'de', to: 'en'}).then(response => {
                t5.travelDescription6 = response.text; // description for DB

                t5.travelDescription7 = t5.travelDescription4 + '\n' + 'Flights from: ' + t5.travelDescription5 + ' to ' + t5.travelDescription6; 
                      

                if (t5.travelDescription7 != '' && t5.travelDescription7 != null && t5.travelTitle2 != null && t5.travelBuy != null && TravelLink4 != null) {
                    Links.insert({ title: t5.travelTitle2, dates:'', description:t5.travelDescription7, image:'', buyLink:t5.travelBuy, link: TravelLink4, datetime: new Date() });
                } 

              }).catch(err => {
                console.error(err);
              });

            }).catch(err => {
              console.error(err);
            });

          }).catch(err => {
            console.error(err);
          });

        }).catch(err => {
          console.error(err);
        });
      
      }


      if (AllLinks[i] != undefined && AllLinks[i] != null && sepLink[2] == "www.letenkyzababku.sk") {
        var TravelLink5 = AllLinks[i];

        var t6 = {
          travelTitle: null,
          travelTitle2: null,
          travelDates2: null,
          travelDates3: null,
          travelDates4: null,
          travelDescription: '',
          travelDescription2: null,
          travelDescription3: null,
          travelDescription4: null,
          travelDescription5: null,
          travelDescription6: null,
          travelDescription7: null,
          travelBuy: null,
        };

        result = HTTP.get(AllLinks[i], {});
        $ = cheerio.load(result.content);

        t6.travelTitle = $('.td-post-title > .entry-title').text();
        var t6count = 0;
        $('.pi_row').each(function(i, elem) {
          var a = $(this);
          t6count++; 

          var auxHtml = a.html();
          var auxText = a.text().split("\n");
          // console.log(auxText);
          // console.log('next');
          // console.log(auxHtml);
          // console.log('next AFTER HTML');

          
          if (auxText[4] != 'Dátum') { var t6date = auxText[4]; }
          if (auxText[1] != 'Z') { var t6from = auxText[1]; }
          if (auxText[2] != 'Do') { var t6to = auxText[2]; }
          if (auxText[3] != 'Cena') { 
            translate(auxText[3], {from: 'sk', to: 'en'}).then(res => {
              var t6price = res.text; // title for DB
              
              translate(t6from, {from: 'sk', to: 'en'}).then(res => {
                var t6from2 = res.text; // title for DB

                translate(t6to, {from: 'sk', to: 'en'}).then(res => {
                  var t6to2 = res.text; // title for DB

                  if (auxHtml) { var t6link = auxHtml.split("href")[1]; }
                  if (t6link) { var t6link2 = t6link.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, ""); }

                  var auxdescribe = 'From '  + t6from2 + ' to ' + t6to2 + ' on ' + t6date + ' ' + t6price + '. Book now <a href="' + t6link2 + '">HERE.</a> \n';
                  t6.travelDescription = t6.travelDescription + auxdescribe;

                  translate(t6.travelTitle, {from: 'sk', to: 'en'}).then(res => {
                    t6.travelTitle2 = res.text; // title for DB
                    console.log(t6count);
                    if (t6count == i+1 && t6.travelDescription != '' && t6.travelDescription != null && t6.travelTitle2 != null && TravelLink5 != null) {
                      console.log(t6.travelDescription);
                      console.log(t6.travelTitle2);
                      Links.insert({ title: t6.travelTitle2, dates:'', description:t6.travelDescription, image:'', buyLink:'', link: TravelLink5, datetime: new Date() });
                    } 

                  }).catch(err => {
                    console.error(err);
                  });  

                }).catch(err => {
                  console.error(err);
                });

              }).catch(err => {
                console.error(err);
              });
              
              
            }).catch(err => {
              console.error(err);
            });
           }
  
        });

      }


      if (AllLinks[i] != undefined && AllLinks[i] != null && sepLink[4] == "TheFlightDeal") {
        var TravelLink6 = AllLinks[i];

        var t7 = {
          travelTitle: null,
          travelTitle2: null,
          travelDates2: null,
          travelDates3: null,
          travelDates4: null,
          travelDescription: '',
          travelDescription2: null,
          travelDescription3: null,
          travelDescription4: null,
          travelDescription5: null,
          travelDescription6: null,
          travelDescription7: null,
          travelDescription8: null,
          travelBuy: null,
          travelBuy2: null
        };

        result = HTTP.get(AllLinks[i], {});
        $ = cheerio.load(result.content);

        t7.traveltitle = $('.post-title').text().trim();
        t7.travelDescription = $('.post-entry').first().text().trim();
        
        if(t7.travelDescription) { t7.travelDescription2 = t7.travelDescription.split("Sample Travel Date:")[1]; } 
        if(t7.travelDescription2) { t7.travelDescription3 = t7.travelDescription2.split("This is just")[0].trim(); } // Sample Travel Date

        if(t7.travelDescription) { t7.travelDescription4 = t7.travelDescription.split("Fare Availability:")[1]; } 
        if(t7.travelDescription4) { t7.travelDescription5 = t7.travelDescription4.split("Please note that")[0]; } // Fare Availability

        if(t7.travelDescription) { t7.travelDescription6 = t7.travelDescription.split("Routing:")[1].trim(); }
        if(t7.travelDescription6) { t7.travelDescription7 = t7.travelDescription6.split('\n')[0]; } // Routing

        if (t7.travelDescription3 && t7.travelDescription5 && t7.travelDescription7) {
          t7.travelDescription8 = t7.travelDescription7 + '\n ' + t7.travelDescription3 + '\n ' + t7.travelDescription5;
        }

        console.log(t7.travelDescription8);

        if ($('.thirstylink').first().attr('href') == null) {
          t7.travelBuy = $('.post-entry').first().html();
          if (t7.travelBuy) { t7.travelBuy2 = t7.travelBuy.split("to Book:").pop().split("<a")[1]; }
          if (t7.travelBuy2) { t7.travelBuy3 = t7.travelBuy2.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, ""); }
        } else {
          t7.travelBuy3 = $('.thirstylink').first().attr('href');
        }

        console.log(t7.travelBuy3);
        

        if (t7.travelDescription8 != '' && t7.travelDescription8 != null && t7.traveltitle != null && t7.travelBuy3 != null && TravelLink6 != null) {
          Links.insert({ title: t7.traveltitle, dates:'', description:t7.travelDescription8, image:'', buyLink:t7.travelBuy3, link: TravelLink6, datetime: new Date() });
        } 
        

      }

      if (AllLinks[i] != undefined && AllLinks[i] != null && sepLink[2] == "www.travelpirates.com") {
        var TravelLink7 = AllLinks[i];

        var t8 = {
          travelTitle: null,
          travelTitle2: null,
          travelDates2: null,
          travelDates3: null,
          travelDates4: null,
          travelDescription: '',
          travelDescription2: null,
          travelDescription3: null,
          travelDescription4: null,
          travelDescription5: null,
          travelDescription6: null,
          travelDescription7: null,
          travelBuy: null,
        };

        result = HTTP.get(AllLinks[i], {});
        $ = cheerio.load(result.content);

        t8.travelTitle = $('.sPost-hl').text(); // title (trnaslate)
        t8.travelDescription = $('.offer-subl').text(); // Time (translate)
        t8.travelDescription2 = $('.offer-rt-rd-o > .offer-rt-rd-lo').text(); // departs from cities ... (translate)
        t8.travelDescription3 = $('.offer-rt-rd-d > .offer-rt-rd-lo').text(); // arrives to cities ... (translate)
        t8.travelBuy = $('.offer-book-lnk').first().attr('href'); // linkas

        if (t8.travelDescription && t8.travelDescription2 && t8.travelDescription3 ) {
          t8.travelDescription4 = t8.travelDescription + '\n' + 'Flights from: ' + t8.travelDescription2 + ' to ' + t8.travelDescription3; 
        }        

        // console.log(t8.travelDescription4);     
        // console.log(t8.travelBuy);  

        if (t8.travelDescription4 != '' && t8.travelDescription4 != null && t8.travelTitle != null && t8.travelBuy != null && TravelLink7 != null) {
            Links.insert({ title: t8.travelTitle, dates:'', description:t8.travelDescription4, image:'', buyLink:t8.travelBuy, link: TravelLink7, datetime: new Date() });
        } 

      
      }


      if (AllLinks[i] != undefined && AllLinks[i] != null && sepLink[2] == "www.jaknaletenky.cz") {
        var TravelLink8 = AllLinks[i];

        var t9 = {
          travelTitle: null,
          travelTitle2: null,
          travelTitle3: null,
          travelMoney: null,
          travelMoney2: null,
          travelTitle2: null,
          travelDates2: null,
          travelDates3: null,
          travelDates4: null,
          travelDescription: '',
          travelDescription2: null,
          travelDescription3: null,
          travelDescription4: null,
          travelDescription5: null,
          travelDescription6: null,
          travelDescription7: null,
          travelBuy: null,
        };

        result = HTTP.get(AllLinks[i], {});
        $ = cheerio.load(result.content);

        t9.travelTitle = $('div.left-container > h1').first().text(); // NEED TRANSLATION
        t9.travelDescription = $('li.tbod').first().text();
        t9.travelBuy = $('blockquote').find('a').attr('href');

        if (t9.travelTitle) { t9.travelMoney = nlp(t9.travelTitle).values().data()[0].NumericValue.cardinal.trim(); }
        if (t9.travelMoney) { t9.travelMoney2 = fx(t9.travelMoney).from('CZK').to('EUR').toFixed(2); }
        if (t9.travelMoney2) { t9.travelTitle2 = t9.travelTitle.replace(/[0-9]/g, '').replace('Kč', t9.travelMoney2 + '€').trim(); }

        if (t9.travelTitle2) {
          translate(t9.travelTitle2, {from: 'cs', to: 'en'}).then(res => {
            t9.travelTitle3 = res.text; // title for DB

            if (t9.travelTitle3) {
              translate(t9.travelDescription, {from: 'cs', to: 'en'}).then(res => {
                t9.travelDescription2 = res.text; // title for DB

                if (t9.travelDescription2 != '' && t9.travelDescription2 != null && t9.travelTitle3 != null && t9.travelBuy != null && TravelLink8 != null) {
                  Links.insert({ title: t9.travelTitle3, dates:'', description:t9.travelDescription2, image:'', buyLink:t9.travelBuy, link: TravelLink8, datetime: new Date() });
                } 

              }).catch(err => {
                console.error(err);
              }); 
            }

          }).catch(err => {
            console.error(err);
          }); 


        }

      }


      if (AllLinks[i] != undefined && AllLinks[i] != null && sepLink[2] == "happyfly.cz") {
        var TravelLink9 = AllLinks[i];

        var t10 = {
          travelTitle: null,
          travelTitle2: null,
          travelTitle3: null,
          travelMoney: null,
          travelMoney2: null,
          travelTitle2: null,
          travelDates2: null,
          travelDates3: null,
          travelDates4: null,
          travelDescription: '',
          travelDescription2: '',
          travelDescription3: null,
          travelDescription4: null,
          travelDescription5: null,
          travelDescription6: null,
          travelDescription7: null,
          travelBuy: null,
        };

        
        headers = {
          'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'
        }
        
        result = HTTP.get(AllLinks[i], {headers});
        $ = cheerio.load(result.content);

        t10.travelTitle = $('.entry-title').text().replace('.', ''); 
        t10.travelDescription = $('li:contains("Tarif")').first().text(); // NEED TRANSLATION
        var auxCount = $('p:contains("Rezervovat")').length;

        if (t10.travelTitle) { t10.travelMoney = convertCurrencyInText(t10.travelTitle, 'CZK'); } // TRANSLATE

        $('p:contains("Rezervovat")').each(function(i, element){
          var a = $(this);
          var aux = a.text().replace('Rezervovat', '');
          var auxLink = a.find('a').attr('href');

          t10.travelDescription2 = t10.travelDescription2 + aux + '. Book now <a href="' + auxLink + '">HERE.</a> \n'; 

          if (i+1 == auxCount) {

            translate(t10.travelMoney, {from: 'cs', to: 'en'}).then(res => {
              t10.travelTitle2 = res.text; // title for DB

              translate(t10.travelDescription, {from: 'cs', to: 'en'}).then(res => {
                t10.travelDescription3 = res.text; // title for DB
                t10.travelDescription4 = t10.travelDescription3 + '\n' + t10.travelDescription2;

                console.log(t10.travelDescription4);
                console.log(t10.travelTitle2);

                if (t10.travelDescription4 != '' && t10.travelDescription4 != null && t10.travelTitle2 != null && TravelLink9 != null) {
                  Links.insert({ title: t10.travelTitle2, dates:'', description:t10.travelDescription4, image:'', buyLink:'', link: TravelLink9, datetime: new Date() });
                } 

              }).catch(err => {
                console.error(err);
              });  

            }).catch(err => {
              console.error(err);
            });   

          }
          
        });

      }


      if (AllLinks[i] != undefined && AllLinks[i] != null && sepLink[2] == "www.cestujlevne.com") {
        var TravelLink10 = AllLinks[i];

        var t11 = {
          travelTitle: null,
          travelTitle2: null,
          travelTitle3: null,
          travelMoney: null,
          travelMoney2: null,
          travelTitle2: null,
          travelDates2: null,
          travelDates3: null,
          travelDates4: null,
          travelDescription: '',
          travelDescription2: '',
          travelDescription3: null,
          travelDescription4: null,
          travelDescription5: null,
          travelDescription6: null,
          travelDescription7: null,
          travelDescription8: null,
          travelDescription9: null,
          travelBuy: null,
        };
        
        result = HTTP.get(AllLinks[i], {});
        $ = cheerio.load(result.content);

        t11.travelTitle = $('h1').first().text();
        if (t11.travelTitle) { t11.travelMoney = convertCurrencyInText(t11.travelTitle, 'CZK'); } // TRANSLATE TITLE

        t11.travelDescription2 = $('div.condition__body').find('h3:contains("Termíny")').next().text();

        var t11count = 0;
        $('div.ticket').each(function(i, element){
          var a = $(this);
          t11count++;
          t11.travelDescription3 = a.find('span:contains("Odkud")').next().text().trim();
          t11.travelDescription4 = a.find('span:contains("Kam")').next().text().trim();
          t11.travelDescription5 = a.find('a.ticket__button').attr('href');

          translate(t11.travelDescription3, {from: 'cs', to: 'en'}).then(res => {
            t11.travelDescription6 = res.text; //  

            translate(t11.travelDescription4, {from: 'cs', to: 'en'}).then(res => {
              t11.travelDescription7 = res.text; // 

              var auxDescribe = 'From ' + t11.travelDescription6 + ' to ' + t11.travelDescription7 + '. Book now <a href="' + t11.travelDescription5 + '">HERE.</a> \n';
              t11.travelDescription = t11.travelDescription + auxDescribe;

              if (t11count == i+1) {
                translate(t11.travelMoney, {from: 'cs', to: 'en'}).then(res => {
                  t11.travelTitle2 = res.text; // title for DB  

                  translate(t11.travelDescription2, {from: 'cs', to: 'en'}).then(res => {
                    t11.travelDescription9 = res.text; // dates  
                    
                    t11.travelDescription8 = t11.travelDescription9 + '\n' + t11.travelDescription;
                    
                    if (t11.travelDescription8 != '' && t11.travelDescription8 != null && t11.travelTitle2 != null && TravelLink10 != null) {
                      Links.insert({ title: t11.travelTitle2, dates:'', description:t11.travelDescription8, image:'', buyLink:'', link: TravelLink10, datetime: new Date() });
                    } 

                  }).catch(err => {
                    console.error(err);
                  }); 

                }).catch(err => {
                  console.error(err);
                }); 

              }

            }).catch(err => {
              console.error(err);
            });                 

          }).catch(err => {
            console.error(err);
          });            

        });

      }


      if (AllLinks[i] != undefined && AllLinks[i] != null && sepLink[2] == "www.flynous.com") {
        var TravelLink11 = AllLinks[i];

        var t12 = {
          travelTitle: null,
          travelTitle2: null,
          travelTitle3: null,
          travelMoney: null,
          travelMoney2: null,
          travelTitle2: null,
          travelDates2: null,
          travelDates3: null,
          travelDates4: null,
          travelDescription: '',
          travelDescription2: '',
          travelDescription3: null,
          travelDescription4: null,
          travelDescription5: null,
          travelDescription6: null,
          travelDescription7: null,
          travelDescription8: null,
          travelDescription9: null,
          travelBuy: null,
        };

        headers = {
          'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36'
        }
        
        result = HTTP.get(AllLinks[i], {headers});
        $ = cheerio.load(result.content);
        t12.travelTitle = $('h1.post-title').text().trim();  
        t12.travelDescription = $('div.entry-content').html();
        if (t12.travelDescription) { 
          t12.travelDescription3 = t12.travelDescription.split('<span id="more')[1].split('<p><strong>Booking')[0]; 

          if (t12.travelDescription3) { t12.travelDescription4 = t12.travelDescription3.replace(/<(?:.|\n)*?>/gm, '').split('\n'); }
          if (t12.travelDescription4) { t12.travelDescription5 = t12.travelDescription4.sort(function (a, b) { return b.length - a.length; })[0]; }

          console.log(t12.travelDescription5)
        }
        
        var t12count = 0;
        $('a[rel="noopener noreferrer"]').each(function(i, element){
          t12count++;
          var a = $(this);  

          if (a.text().length > 2) {
            var auxDescribe = a.text();
            var auxLink = a.attr('href');
            t12.travelDescription2 = t12.travelDescription2 + 'Flight: ' + '<a href="' + auxLink + '">' + auxDescribe + '\n';
          }

          if (t12count == i+1) {
            t12.travelDescription6 = t12.travelDescription5 + '\n' + t12.travelDescription2;

            if (t12.travelDescription6 != '' && t12.travelDescription6 != null && t12.travelTitle != null && TravelLink11 != null) {
              Links.insert({ title: t12.travelTitle, dates:'', description:t12.travelDescription6, image:'', buyLink:'', link: TravelLink11, datetime: new Date() });
            } 
            
          }
        

        });
        // 

        

        console.log(t12.travelTitle);
        
      }

  }
  
    return "finished";

  } catch(exception) {
    module.reject(`[sendLinks] ${exception}`);
  }
}

const getLinks = () => {
  try {
    var LinksDB = [];
    const visi = Links.find({}, {sort: {datetime: -1}, limit: 10}).fetch();

    if (visi.length > 0) {
      for(j = 0; j < visi.length; j++) {
        LinksDB.push(visi[j].link)
      }
    }
      
    return LinksDB;

  } catch (exception) {
    module.reject(`[getLinks] ${exception}`);
  }
};

const getExchange = () => {
  try {
    const rates = Rates.findOne({_id: 'abc'});      
    return rates;

  } catch (exception) {
    module.reject(`[getLinks] ${exception}`);
  }
};

const getExtLinks = () => {
  try {

    result = HTTP.get("http://www.flightor.com/", {});
    $ = cheerio.load(result.content);
    var finalResults = [];

    $('a.collapsed').each(function(i, element){
      var newObj = {
        link: ''
      };
      var a = $(this);
      var str = a.text();
      // var results = str.match(/("[^"]+"|[^"\s]+)/g);
      var checkLink = a.parent().parent().parent().find('.hidden-sm').find('a').attr('href');

      if(checkLink.split('/')[4] == 'akcniletenky') {

      } else {
        newObj.link = checkLink;
        finalResults.push(checkLink);
      }

      
      
      // var from = a.children()
    });

    return finalResults.slice(0,10);

  } catch (exception) {
    module.reject(`[getExtLinks] ${exception}`);
  }
};

const handler = (options, promise) => {
  try {
    module = promise;
    console.log('Fetching started...');

    const ExchangeRates = getExchange();
    fx.rates = ExchangeRates.rates;
    fx.base = ExchangeRates.base;

    var ExtLinks = getExtLinks();
    const IntLinks = getLinks();
    const AllLinks = ExtLinks.concat(IntLinks);
    const NewLinks = removeDuplicates(AllLinks);

    ExtLinks = ExtLinks.reduce(function (prev, value) {

      var isDuplicate = false;
      for (var i = 0; i < IntLinks.length; i++) {
          if (value == IntLinks[i]) {
              isDuplicate = true;
              break;
          }
      }
        
      if (!isDuplicate) {
          prev.push(value);
      }
        
      return prev;
        
    }, []);

    // console.log(ExtLinks);

    console.log('====== FROM DB =====');
    console.log(IntLinks.length);
    console.log(IntLinks);
    console.log('====== FROM FLIGHTOR =====');
    console.log(ExtLinks.length);
    console.log(ExtLinks);

    sendLinks(['http://www.flynous.com/5-qatar-airways-return-flights-from-brussels-to-bali-from-e468/']);

    // const tasksByUser = getTasksByUser(users);
    // sendTasksToUsers(tasksByUser);
  } catch (exception) {
    module.reject(`[sendDailyTasks.handler] ${exception}`);
  }
};

export const sendDailyTasks = (options) =>
new Promise((resolve, reject) =>
handler(options, { resolve, reject }));
