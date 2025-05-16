const express = require("express");
const admin = require("firebase-admin");
const serviceAccountKey = require("./servicesAccounKey.json");
const cors = require = require
require("dotenv/config");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
});

const app = express(
    app.use(bodyParse.json()));

app.get('/' , (req, res) => {
    res.send("Hai. ini adalah res api dari fasum")
})

        app.post("/sent-to-topic", async (req, res) => {
        const {topic, title,body, senderName,senderPhotoUrl} = req.body;
        if(!topic || !title || !body || !senderName || !senderPhotoUrl){
            return res.status(400).json({message:"token,  title dan body harus diisi"})
        }

        const massage = {
            notification: {
                title : title ,
                body : body,
            },
            data: {
                title : title || "Notifikasi Baru", 
                body : body || "Anda memiliki notifikasi baru",
                senderName : senderName || "Admin",
                senderPhotoUrl : senderPhotoUrl || "",
                sandAt : Date.now(),
                massageType : "notification"
            },
            android :{
                priority : "high",
            },apns: {
                headers:{
                    "apns-priority": "10",
                }
            }
        }

        try{
            const response = await admin.messaging().send(massage);
            res.status(200).json({
                message:"berhasil mengirim notifikasi",
                success: true,
                response
            })
        }catch(err){
            res.status(500).json({
                message:"gagal mengirim notifikasi",
                success: false,
                err
            })
        }
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
