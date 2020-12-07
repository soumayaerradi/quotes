//Firebase Admin SDK
let admin = require("firebase-admin");

let serviceAccount = require("./../serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//express module
const express = require("express");
const router = express.Router();

//remote db
const db = admin.firestore();

//local db
const quotes =[];




//Univoque id generator
function genId() {  
return quotes.length > 0 ? Math.max(...quotes.map(quote => quote.id)) + 1 : 1
}

//POST /quotes
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

//export module
module.exports = router;