const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const serviceAccount = require('./serviceAccountKey.json');
const cors = require('cors');
require('dotenv').config();

// Inisialisasi Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint root
app.get('/', (req, res) => {
    res.send('Hai, ini adalah REST API untuk Fasum!');
});

// Endpoint untuk mengirim notifikasi ke topik tertentu
app.post('/send-to-topic', async (req, res) => {
    const { topic, title, body, senderName, senderPhotoUrl } = req.body;

    // Validasi input
    if (!topic || !title || !body) {
        return res.status(400).json({
            success: false,
            error: 'Field topic, title, dan body wajib diisi.',
        });
    }

    // Payload notifikasi
    const message = {
        topic,
        notification: {
            title,
            body,
        },
        data: {
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
                'apns-priority': '10',
            },
        },
    };

    try {
        const response = await admin.messaging().send(message);
        res.status(200).json({
            success: true,
            message: `Notifikasi berhasil dikirim ke topic "${topic}"`,
            response,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

// Jalankan server di PORT dari .env atau default ke 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
