const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const userRoutes = require("./routes");
app.use(userRoutes);

app.get("/",(req,res) => {
    return res.json({message:"go to /quotes"});
});


app.listen(3000, () => {
    console.log("go to http://localhost:3000");
});
