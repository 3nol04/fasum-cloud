const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const serviceAccount = require('./serviceAccountKey.json');
const cors = require('cors');
require('dotenv').config();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hai, ini adalah REST API untuk Fasum!');
});

app.post('/send-to-topic', async (req, res) => {
    const { topic, title, body, senderName, senderPhotoUrl } = req.body;

    if (!topic || !title || !body ) {
        return res.status(400).send({error: 'token, title, dan body wajib diisi.'});
    }

    const message = {
        notification: {
            title: title,
            body: body,
        },
        data:{
            title: title || 'Notifikasi Baru',
            body: body || 'Anda memiliki notifikasi baru',
            senderName: senderName || 'Admin',
            senderPhotoUrl: senderPhotoUrl || '',
            sendAt: new Date().toISOString(),
            messageType: 'topic-notification',
        },
        android: {
            priority: 'high',
        },
        apns: {
            headers: {
                'apns_priority' : '10'
            }
        }
    }

    try {
        const response = await admin.messaging().send(message);
        res.status(200).json({
            success: true,
            message: `Notifikasi berhasil dikirim ke topic ${topic}`,
            response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});