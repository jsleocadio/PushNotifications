## NodeJS Backend
So now we are all set at our firebase configurations. Lets create our backend that will receive an API request and send an actual Notification to a device.

First, create a folder with a name that you choose and navigate to that folder using your terminal or command prompt (windows users).

Type (on your terminal) `npm init` and fill in all required details. This will create a simple package.json. Now navigate to that project using your terminal.

The next step is to install a dependency we will need for sending the firebase notification, install the dependency by running `npm i firebase-admin` on your terminal. You can find the dependency details [here](https://www.npmjs.com/package/firebase-admin).

Also, run the following commands to install dependencies we will need for our nodeJS express server to run and parse JSON bodies without errors. `npm i express` and `npm i cors`.

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
const admin = require('./firebase-config')
const cors = require('cors')

const corsOptions = {
    origin:'http://localhost:8100', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

const app = express()
app.use(express.json())
app.use(cors(corsOptions))

const db = admin.admin.firestore()

const port = 3000
const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
}
app.post('/notification/device', (req, res) => {
    const message = req.body.message
    const options = notification_options
    const tokensRef = db.collection('tokens')
    tokensRef.get().then(snapshot => {
        snapshot.forEach(doc => {
            admin.admin.messaging().sendToDevice(doc.data().token, message, options)
            .then(response => {
                res.status(200).send("Notificação enviada com sucesso!")
            })
            .catch(error => {
                console.log(error)
            })
        })
    })
})

app.post('/registration', (req, res) => {
    const token = req.body.token
    const tokensRef = db.collection('tokens')
    const queryRef = tokensRef.where('token', '==', token)
    queryRef.get().then(response => {
        if (response.size != 0) {
            res.status(200).send("Token já cadastrado!")
        } else {
            tokensRef.add({
                token: token,
                timeStamp: new Date()
            })
            res.status(200).send("Token cadastrado com sucesso!")
        }
    })
})

app.listen(port, () => {
    console.log("listening to port: " + port)
})
```

This is what the code does:

We initialize express since we will be using it to create and run our server, then import the admin value we exported from our configuration file for firebase and import cors.

We declare our `corsOptions` that has our rules to accept or decline the HTTP requests.

We then initialize express and assign to it an app value, which we can use for API calls on our server.

We also initialize `db` as our **Firestore Database**, because ours clients has to send their tokens to our server and we need the Registration Token to send messages.

We then initialize the priorities for our notifications:

1. **priority: “high”** — high priority messages will be delivered immediately and remote notifications will be displayed without delay.
2. **timeToLive** — This is the time the message takes to expire

Next, we create a POST request on our API using the endpoint **‘/notification/device’**. We extract our message and we use `messaging().sendToDevice()` methods of firebase-admin package to send our notification. We pass our registration token, message and options as parameters.

For last, we create a POST request on our API using the endpoint **'/registration'**. We extract the Registration token and verify if that token already is saved. Using `db.collection('tokens')` we can access our collection of tokens and with `tokensRef.where('token', '==', token)` we search if the token is already there. If isn't, we using `tokensRef.add` to add a token with timestamp in our collection.

*Note that the message must be in the following format so that the notification is not shown as a silent notification but an actual push notification*

Adapted from: [Julla’s Github repository](https://github.com/Julla-inc/firebase-nodejs).
