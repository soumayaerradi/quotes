const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const quoteRoutes = require("./routes");
app.use(quoteRoutes);

app.get("/", (req, res) => {
    return res.json("Start with /quotes");
});

app.listen(3000, ()=>{
    console.log("Go to http://localhost:3000");
});
