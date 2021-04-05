const {SchemaConnector, StateUpdateRequest} = require('st-schema');
const deviceStates = { switch: 'off',thermostatMode:'off',temperature:12,healthStatus:'online',coolingSetpoint:8,heatingSetpoint:30}//1-10
const RESTrequest = require('request');
require('dotenv').config();

let accessTokens = {}; //Currently, if the server is reseted, this value will be lost

const connector = new SchemaConnector()
    .enableEventLogging(2)
    .clientId(process.env.ST_CLIENT_ID)
    .clientSecret(process.env.ST_CLIENT_SECRET)
    .discoveryHandler((accessToken, response) => {         
      const d = response.addDevice('smartThermostat3', 'smartThermostat3', 'ed0f1f26-3365-4b90-903f-cc2f1973495e')
      //Device manufacturer
      d.manufacturerName('smartThermostat3');
      //Device model
      d.modelName('smartThermostat3');
    })
    .stateRefreshHandler((accessToken, response) => {
      response.addDevice('smartThermostat3', [
        {
          component: 'main',
          capability: 'st.switch',
          attribute: 'switch',
          value: deviceStates.switch
        },
        {
          component: 'main',
          capability: 'st.thermostatMode',
          attribute: 'thermostatMode',
          value: deviceStates.thermostatMode
        },
        {
          component: 'main',
          capability: 'st.temperatureMeasurement',
          attribute: 'temperature',
          value: deviceStates.temperature,
          unit:'C'
        },
        {
          component: 'main',
          capability: 'st.healthCheck',
          attribute: 'healthStatus',
          value: deviceStates.healthStatus
        },
        {
          component: 'main',
          capability: 'st.thermostatCoolingSetpoint',
          attribute: 'coolingSetpoint',
          value: deviceStates.coolingSetpoint,
          unit:'C'
        },
        {
          component: 'main',
          capability: 'st.thermostatHeatingSetpoint',
          attribute: 'heatingSetpoint',
          value: deviceStates.heatingSetpoint,
          unit:'C'
        }
      ])
    })
    .commandHandler((accessToken, response, devices) => {
      for (const device of devices) {
        const deviceResponse = response.addDevice(device.externalDeviceId);
        for (const cmd of device.commands) {
          const state = {
            component: cmd.component,
            capability: cmd.capability
          };
          const state2 = {
            component: cmd.component
          };
          if (cmd.capability === 'st.thermostatMode' && cmd.command === 'setThermostatMode') {
            state.attribute = 'thermostatMode';
            state.value = deviceStates.thermostatMode = cmd.arguments[0]
            deviceResponse.addState(state);
            //health
            state2.capability = 'st.healthCheck'
            state2.attribute = 'healthStatus';
            state2.value = deviceStates.healthStatus = "online";
            deviceResponse.addState(state2);

          } else if (cmd.capability === 'st.thermostatHeatingSetpoint' && cmd.command === 'setHeatingSetpoint'){
            state.attribute = 'heatingSetpoint';
            state.value = deviceStates.heatingSetpoint = cmd.arguments[0]
            deviceResponse.addState(state);

            //health
            state2.capability = 'st.healthCheck'
            state2.attribute = 'healthStatus';
            state2.value = deviceStates.healthStatus = "online";
            deviceResponse.addState(state2);
          } else if (cmd.capability === 'st.thermostatCoolingSetpoint' && cmd.command === 'setCoolingSetpoint'){
            state.attribute = 'coolingSetpoint';
            state.value = deviceStates.coolingSetpoint = cmd.arguments[0]
            deviceResponse.addState(state);
            //health
            state2.capability = 'st.healthCheck'
            state2.attribute = 'healthStatus';
            state2.value = deviceStates.healthStatus = "online";
            deviceResponse.addState(state2);
          } else  if (cmd.capability === 'st.switch') {
            state.attribute = 'switch';
            state.value = deviceStates.switch = cmd.command === 'on' ? 'on' : 'off';
            deviceResponse.addState(state);
            //health
            state2.capability = 'st.healthCheck'
            state2.attribute = 'healthStatus';
            state2.value = deviceStates.healthStatus = "online";
            deviceResponse.addState(state2);
          } else
          {
            deviceResponse.setError(
                `Command '${cmd.command} of capability '${cmd.capability}' not supported`,
                DeviceErrorTypes.CAPABILITY_NOT_SUPPORTED)
          }
        }
      }
    })
    .callbackAccessHandler((accessToken, callbackAuthentication, callbackUrls) => {
      //Here's where we receive the tokens for the callbacks
      /*Eg.
        callbackAuthentication: {
          tokenType: 'Bearer',
          accessToken: 'eyJhbGciOiJIUzM4NCJ9.....',
          refreshToken: 'eyJhbGciOiJIUzM4NCJ9....',
          expiresIn: 86400
        },
        callbackUrls: {
          oauthToken: 'https://c2c-us.smartthings.com/oauth/token',
          stateCallback: 'https://c2c-us.smartthings.com/device/events'
        }
      */
      accessTokens = {
        callbackAuthentication,
        callbackUrls
      }
    })
    .integrationDeletedHandler(accessToken => {
      accessTokens = {};
    });

    function getaccessTokens(){
      return accessTokens
    }

module.exports =  {
  connector: connector,
  deviceStates: deviceStates,
  getaccessTokens: getaccessTokens
};