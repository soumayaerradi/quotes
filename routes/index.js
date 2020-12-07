const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccount.json");

const router = express.Router();

quotes = [];

async function updateQuotes(){
    quotes.length = 0;
    const list = await db.collection("quotes").get();
    list.forEach(doc => quotes.push(doc.data()));
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

router.get("/quotes", async (req, res) => {
    try {
        await updateQuotes();
        return res.status(200).json(quotes);
    } catch (error) {
        return res.status(500).send(error);
        }
});

module.exports = router;