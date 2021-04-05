# st-schema-devstatecallback
This sample shows how to use the stateCallbacks for a SmartThings Schema Connector in order to:
1. Update the device state
2. Trigger the Integration deleted interaction type from the Third-Party cloud side.

## Pre-requisites
1.  OAuth Server (See [1] and [2] in the references section).
2.  A [Samsung Developer Workspace account](https://smartthings.developer.samsung.com/workspace).
3.  The SmartThings mobile app (available from the [iOS](https://apps.apple.com/us/app/smartthings/id1222822904) App Store or Google [Play Store](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect)).
4. For local execution: Node JS and [Ngrok](https://ngrok.com/) to create the HTTPS tunnel.

*Note: You can upload the code to other tools such as [Glitch](https://glitch.com/).*

## Connector Setup
1. Clone or download this repository.
2. Install all the necessary modules using the command: `npm install`
3. Follow the [instructions](https://smartthings.developer.samsung.com/docs/devices/smartthings-schema/schema-basics.html#Register-Connector-in-Developer-Workspace) to register a Webhook Connector. (See the sample of the reference no.2)
4. Create an .env file as shown in .env-example
  - The PORT will depend on your preferences.
  - The `ST_CLIENT_ID` and `ST_CLIENT_SECRET` are the values generated in the Developer Workspace after you register the Connector.
5. Create a [Device profile](https://smartthings.developer.samsung.com/docs/devices/device-profile.html#Creating-a-device-profile) with the following capabilities:
  - Switch
  - Thermostat Mode
  - Temperature Measurement
  - Health Check
  - Thermostat Cooling Setpoint
  - Thermostat Heating Setpoint
6. Replace "device-profile-id" by the generated ID at the 13th line of the `connector.js` file.
7. Run this project with the command `node .`

## Install Device
1. Open the ST mobile app (make sure you enabled the[Developer mode](https://smartthings.developer.samsung.com/docs/testing/developer-mode.html#Enable-developer-mode))
2. Select "add" (+) > "Device" > My testing devices > Select the Schema Connector
3. Choose in which `location` and `room` you want to install the device.
4. You'll be redirected to the login page of your OAuth Server (Authorization URI).
5. It'll be send to the `Token URI` afterwards where the OAuth Server provides an Authentication Token. (it's very important for the callbacks)
6. If everything is correct, you should be able to see a "Success" message, there wouldn't be any  [interaction result](https://smartthings.developer.samsung.com/docs/devices/smartthings-schema/smartthings-schema-reference.html#Interaction-Result) in the logs and the device should be added in the corresponding location.
7. You should be able to call the stateCallbacks using the endpoints in `server.js` (`/command` and `/delete`)


## References
- [1] [My Cloud Connector Example](https://github.com/SmartThingsCommunity/MyCloudToCloudSchemaConnection)
- [2] [ST Schema simple tutorial](https://community.smartthings.com/t/schema-devices-and-custom-capabilities/199675)
- [3] [Interaction Types](https://smartthings.developer.samsung.com/docs/devices/smartthings-schema/smartthings-schema-reference.html)