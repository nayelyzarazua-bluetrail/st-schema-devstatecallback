/**
 * Express web server configured to host ST Schema connector
 */

 require('dotenv').config();
 const express = require('express')
 const {StateUpdateRequest} = require('st-schema');
 const {connector, deviceStates, getaccessTokens} = require('./connector');
 
 const PORT = process.env.PORT || 3000;
 const server = express();
 server.use(express.json());
 let accessTokens = {};
 
 server.post('/', (req, res) => {
   if (accessTokenIsValid(req, res)) {
     connector.handleHttpCallback(req, res)
   }
 })

 //***********for callbacks purposes***********//

 //Update device state, it's currently manual
 server.post('/command', (req, res) => {
   deviceStates[req.body.attribute] = req.body.value;
   accessTokens=getaccessTokens()
     const updateRequest = new StateUpdateRequest(process.env.ST_CLIENT_ID, process.env.ST_CLIENT_SECRET);
     const deviceState = [
       {
         externalDeviceId: 'smartThermostat3',
         states: [
           {
             "component": "main",
             "capability": "st.thermostatMode",
             "attribute": "thermostatMode",
             "value": "eco"
           },
           {
             "component": "main",
             "capability": "st.healthCheck",
             "attribute": "healthStatus",
             "value": "online"
           }
         ]
       }
     ];
   updateRequest.updateState(accessTokens.callbackUrls, accessTokens.callbackAuthentication, deviceState)
   .then((response)=>{
    console.log("update successful ", response)
   })
   .catch((error)=>{
    console.log("update error ", error)
   })
   res.send({});
   res.end()
 });
 
 //Delete the integration from the third party cloud
 //Eg. if we use Postman
 //https://this-server-url/delete
 server.post('/delete', (req, res) => {
    accessTokens=getaccessTokens()
    const globalError = {
      errorEnum: "INTEGRATION-DELETED",
      detail: "The integration was deleted from the cloud"
    }
     const updateRequest = new StateUpdateRequest(process.env.ST_CLIENT_ID, process.env.ST_CLIENT_SECRET);
     updateRequest['globalError']=globalError
     updateRequest.updateState(accessTokens.callbackUrls, accessTokens.callbackAuthentication, deviceState)
     .catch((error)=>{//it shouldn't be successful as globalError causes an exception that will delete the integration
      console.log("delete success ", error)
     })
   res.send({});
   res.end()
 })
 
 function accessTokenIsValid(req, res) {
   // Replace with proper validation of issued access token. 
   console.log('req.body.authentication.token ',req.body.authentication.token);
   return true;
 }
 
 server.listen(PORT);
 console.log(`Server listening on http://127.0.0.1:${PORT}`);
 