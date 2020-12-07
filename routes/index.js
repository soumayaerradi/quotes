//Chiave di Firebase
let admin = require("firebase-admin");

let serviceAccount = require("./../serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const express = require("express");
const router = express.Router();
const db = admin.firestore();
const quotes =[];


//FEATURE POST

//generatore di id univoci
function genId() {  
return quotes.length > 0 ? Math.max(...quotes.map(quote => quote.id)) + 1 : 1
}

router.post("/quotes", async(req,res) =>{
    try{
        let list = await db.collection('quotes').get();
        list.forEach(doc => quotes.push(doc.data()));
        if(!req.body.author || !req.body.quote){
            return res.status(404).json ({message: "insert quote or author!"});
        }
        const newId = genId();
        let q = {
            id: newId,
            quote: req.body.quote,
            author: req.body.author
        }
        db.collection('quotes').doc(newId.toString()).set(q);
        return res.status(201).json({ message: "Created" });
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;