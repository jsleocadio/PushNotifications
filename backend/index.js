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

