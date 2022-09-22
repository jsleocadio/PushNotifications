# Firebase Push Notifications To Android Using NodeJS
So, you are developing a mobile application, and you realize you need a way to communicate to your users in a quick, cost-efficient way. At this point, I’m sure you have thought about push notifications. That’s where Firebase Cloud Messaging (FCM) comes in.

Firebase Cloud Messaging (FCM) provides a reliable and battery-efficient connection between your server and devices that allows you to deliver and receive messages and notifications on iOS, Android, and the web at no cost. You can read more about it [here](https://firebase.google.com/products/cloud-messaging/).

Now that we are done with the introduction, let's dive all in.

First, you need to sign in with your Google account at [firebase](http://firebase.google.com/). Then click the ‘Go to console’ link right next to your account avatar and you will be redirected to the dashboard console where you can view all your projects.

Since at this point we don’t have any project, click ‘**create a project**’

![image](https://user-images.githubusercontent.com/73944895/191836551-4e8783c7-7224-433b-8598-e4e41b0fd0de.png)

Type the name of the project and agree to the terms and conditions, proceed through all the necessary steps and when done, the project will be created and you will be redirected to the dashboard.

***

So, now that we have a firebase account, lets try to understand how this will work.

First, firebase push notifications will need the following for it to function properly.

1. A configuration JSON file that can be downloaded from the console. This file contains the project details required by firebase for initialization and secure connection to firebase. We will see how to generate the file shortly.
2. A registration Token. Think about it for a second. If firebase needs to send a particular message to a particular device(in our case a particular mobile device), then we need to inform it to which device it should send. Thats where the registration token comes in. The registration token is generated from the mobile app and will be sent via API to our NodeJS backend from where we will send the actual notification. However, since in this tutorial we will not be focusing on creating the mobile application , follow this [link](https://www.androidauthority.com/android-push-notifications-with-firebase-cloud-messaging-925075/) to see how to create the mobile application and get the registration token for your device, which you can then send to the API for your device to get the notifications.
#### Configuration JSON file

To get this file, go to your console and on the menu you will see **‘Project Overview’**. Click the settings cog icon right next to it to reveal a sub menu with two menu items (Project Settings, Users and permissions).

![image](https://user-images.githubusercontent.com/73944895/191838159-a18e98d7-5a33-4504-94c2-3fa08ac3d821.png)

Click ‘**Project Settings**’ , then General. Scroll to the bottom to ‘**your apps**’ section. Click the android icon (since using the [tutorial link](https://www.androidauthority.com/android-push-notifications-with-firebase-cloud-messaging-925075/) i shared before you created a mobile app and generated the registration token). This will enable us to register the mobile application with firebase.

![image](https://user-images.githubusercontent.com/73944895/191838543-65205b6c-c413-40e7-9cfc-81657ca4b6b9.png)

To register the app, fill in all the required details and finish. Note that you can skip step 4 (running the app to verify installation) using the small link(skip this step). Also since you already added firebase in the mobile app you can skip steps 2 and 3.

Now that this is done, navigate to the tab ‘**Service account**’ . At the ‘**Firebase Admin SDK**’ section, click ‘**Generate new private key**’ button and confirm you want to download it. Our JSON file we needed will now be created and downloaded. Also in the code sample snippet given, copy the database url since we will need it in the next step.

![image](https://user-images.githubusercontent.com/73944895/191838711-6824af66-e985-4c84-8664-d97dd48825c1.png)

## NodeJS Backend
So now we are all set at our firebase configurations. Lets create our backend that will receive an API request and send an actual Notification to a device.

First, create a folder with a name that you choose and navigate to that folder using your terminal or command prompt (windows users).

Type (on your terminal) `npm init` and fill in all required details. This will create a simple package.json. Now navigate to that project using your terminal.

The next step is to install a dependency we will need for sending the firebase notification, install the dependency by running `npm i firebase-admin` on your terminal. You can find the dependency details [here](https://www.npmjs.com/package/firebase-admin).

Also, run the following commands to install dependencies we will need for our nodeJS express server to run and parse JSON bodies without errors. `npm i express`.

Now we are good with the dependencies. Within the same directory, create a config file, that we will use to initialize firebase in our app. Your code will look like this

```
const admin = require("firebase-admin");
const serviceAccount = require("path/to/service.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: '<FIREBASE.DATABASE.URL>'
})

module.exports.admin = admin
```

This is what the code does:

First we import the dependency we installed earlier **‘firebase-admin’** and assign it to a variable admin.

Then we import the JSON file we downloaded from our console earlier and initialize our app, with the credential as the JSON and the database URL we copied from our console earlier.

We then export our admin value so that we can use it in the index file to send our notifications.

Now that we have configured firebase, let’s create an index.js file that will work as our simple server for now. In the same directory create index.js file and paste the following code.

```
const express = require('express')
const bodyparser = require('body-parser')
const admin = require('./firebase-config')
const cors = require('cors')

const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

const app = express()
app.use(bodyparser.json())
app.use(cors(corsOptions))

const port = 3000
const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
}
app.post('/notification/device', (req, res) => {
    const registrationToken = req.body.registrationToken
    const message = req.body.message
    const options = notification_options

    admin.admin.messaging().sendToDevice(registrationToken, message, options)
    .then(response => {
        res.status(200).send("Notificação enviada com sucesso!")
    })
    .catch(error => {
        console.log(error)
    })
})

app.listen(port, () => {
    console.log("listening to port: " + port)
})
```

This is what the code does:

We initialize express since we will be using it to create and run our server, then initialize body-parser, and import the admin value we exported from our configuration file for firebase.

We then initialize express and assign to it an app value, which we can use for API calls on our server.

We then initialize the priorities for our notifications:

1. **priority: “high”** — high priority messages will be delivered immediately and remote notifications will be displayed without delay.
2. **timeToLive** — This is the time the message takes to expire
Next, we create a POST request on our API using the endpoint **‘/notification/device’**. We extract our message and registration token (received from the mobile app) and we use `messaging().sendToDevice()` methods of firebase-admin package to send our notification. We pass our registration token, message and options as parameters.

*Note that the message must be in the following format so that the notification is not shown as a silent notification but an actual push notification*

Adapted from: [Julla’s Github repository](https://github.com/Julla-inc/firebase-nodejs).
