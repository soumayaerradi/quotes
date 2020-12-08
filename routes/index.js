const express= require("express");
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

function genId() {
    return quotes.length > 0 ? Math.max(...quotes.map(quote => quote.id)) + 1 : 1
}

router.get("/quotes", async (req, res) => {
    try {
        await updateQuotes();
        return res.status(200).json(quotes);
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.get("/quotes/:id", async (req,res) => {
    try{
        const quote= await db.collection('quotes').doc(req.params.id).get();
        if(!quote){
            return res.status(404).json({message:"user not found"});
        }
        return res.status(200).json(quote.data());
    }catch(error){
        return res.status(500).send(error);
    }
});

router.post("/quotes", async(req,res) =>{
    try{
        let list = await db.collection('quotes').get();
        list.forEach(doc => quotes.push(doc.data()));
        if(!req.body.author || !req.body.quote){
            return res.status(400).json ({message: "Bad request: missing quote or author in the request body!"});
        }
        const newId = genId();
        let newQuote = {
            id: newId,
            quote: req.body.quote,
            author: req.body.author
        }
        db.collection('quotes').doc(newId.toString()).set(newQuote);
        return res.status(201).json({ message: "Created" });
    } catch (error) {
        return res.status(500).send({error:error.toString()});
    }
});

router.patch("/quotes/:id", async (req,res) => {
    try {
        quotes.length = 0;
        const list = await db.collection("quotes").get();
        list.forEach(doc => quotes.push(doc.data()));

        if (!req.body.quote && !req.body.author){
            return res.status(400).json({message: "You have to pass a quote and/or an author :/"});
        }
        const q = await db.collection("quotes").doc(req.params.id).get();
        if (!q.data()){
            return res.status(404).json({message: "Quote not found :("});
        }

        if (req.body.quote && req.body.author){
            db.collection("quotes").doc(req.params.id).set({quote: req.body.quote, author: req.body.author}, {merge: true});
            return res.json({message: "Updated"});
        }
        if (req.body.quote){
            db.collection("quotes").doc(req.params.id).set({quote: req.body.quote}, {merge: true});
            return res.json({message: "Updated"});
        }
        if (req.body.author){
            db.collection("quotes").doc(req.params.id).set({author: req.body.author}, {merge: true});
            return res.json({message: "Updated"});
        }

    } catch (error) {
        return res.status(500).send(error);
    }
});

router.delete("/quotes/:id", async (req, res) => {
    try {

        const q = await db.collection('quotes').doc(req.params.id).get();
        if(!q.data()){
            return res.status(404).json({message: "quote not found"});
        }


        db.collection("quotes").doc(req.params.id).delete();

        return res.status(200).json({message: "Deleted"});

    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;
