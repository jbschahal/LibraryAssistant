'use strict';

const ACTION_PRICE = 'price';

const axios = require("axios");
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
        
        const url = "https://maps.googleapis.com/maps/api/geocode/json?address=Florence";
        axios
          .get(url)
          .then(response => {
            console.log(
              `City: ${response.data.results[0].formatted_address} -`,
              `Latitude: ${response.data.results[0].geometry.location.lat} -`,
              `Longitude: ${response.data.results[0].geometry.location.lng}`
            );
            var msg = response.data.results[0].formatted_address;
            console.log("message: " + msg);
            app.tell(msg);
          })
          .catch(error => {
            console.log(error);
          });
  }
  
  const actionMap = new Map();
  actionMap.set(ACTION_PRICE, priceHandler);
  //actionMap.set(ACTION_TOTAL, totalHandler);
  app.handleRequest(actionMap);
  
  
});