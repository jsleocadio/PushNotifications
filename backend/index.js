const express = require('express')
const admin = require('./firebase-config')
const cors = require('cors')

const db = admin.admin.firestore()

const corsOptions = {
    origin:'http://localhost:8100', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

const app = express()
app.use(express.json())
app.use(cors(corsOptions))

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
            .then(responde => {
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

