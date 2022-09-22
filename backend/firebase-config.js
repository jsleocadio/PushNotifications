const admin = require("firebase-admin");
const serviceAccount = require("./config.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://mensagens-9706f-default-rtdb.firebaseio.com/'
})

module.exports.admin = admin