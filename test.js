'use strict';

const ACTION_PRICE = 'price';

const http = require('https');

const functions = require('firebase-functions'); // Cloud Functions for Firebase library
const App = require('actions-on-google').DialogflowApp; // Google Assistant helper library
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((req, resp) => {
    
    const app = new App({request: req, response: resp});
    let action = req.body.result.action; // https://dialogflow.com/docs/actions-and-parameters
    let parameters = req.body.result.parameters; // https://dialogflow.com/docs/actions-and-parameters
    let inputContexts = req.body.result.contexts; // https://dialogflow.com/docs/contexts
    let requestSource = (req.body.originalRequest) ? req.body.originalRequest.source : undefined;
    const googleAssistantRequest = 'google'; // Constant to identify Google Assistant requests
    
    function priceHandler (app) {
        console.log("Testing Testing");
        var options = {
            host: 'maps.googleapis.com', 
            path:'/maps/api/geocode/json?address=Florence'
        };
        var data = '';
        var re = http.request(options, function (response) {
                response.on('data', function (chunk) {
                data += chunk;
            });
            response.on('end', function () {
                //console.log("json is: " + data);
                console.log("data is: " + data);
                data = JSON.parse(data);
                console.log("parsed data is: " + data);
                let json = JSON.stringify(data);
                console.log("json is: " + json);
                //console.log("The parsed data is: "+ json.result[0].formatted_address);
                const msg = json.results[0].formatted_address;
                app.tell(msg);
            });
        });
        re.on('error', function (e) {
            console.log(e.message);
        });
        re.end();
  }
  
  const actionMap = new Map();
  actionMap.set(ACTION_PRICE, priceHandler);
  //actionMap.set(ACTION_TOTAL, totalHandler);
  app.handleRequest(actionMap);
  
  
});