const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccount.json");
const router = express.Router();
const quotes = [];

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function genId(quotes) {
    return quotes.length > 0 ? Math.max(...quotes.map(quote => quote.id)) + 1 : 1;
}

// PATCH
router.patch("/quotes/:id", async (req,res) => {
    try {
        quotes.length = 0;
        const list = await db.collection("quotes").get();
        list.forEach(doc => quotes.push(doc.data()));

        if (!req.body.quote && !req.body.author){
            return res.status(400).json({message: "You have to pass a quote and/or an author :/"});
        } 
        const q = await db.collection("quotes").doc(req.params.id).get();
        console.log(q);
        if (!q.data()){
            return res.status(404).json({message: "Quote not found :("});
        }
        
        if (req.body.quote){
            db.collection("quotes").doc(req.params.id).set({quote: req.body.quote}, {merge: true});
            return res.json({message: "Updated"});
        }
        if (req.body.author){
            db.collection("quotes").doc(req.params.id).set({author: req.body.author}, {merge: true});
            return res.json({message: "Updated"});
        }
        
        // const quote = quotes.find(valore => valore.id === Number(req.params.id));
        // if (req.body.quote){
        //     quote.quote = req.body.quote;
        //     return res.json({message: "Updated"});
        // }
        // if (req.body.author) {
        //     quote.author = req.body.author;
        //     return res.json({message: "Updated"});
        // }
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;