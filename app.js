
const express = require("express");
const fetch = require("node-fetch");
require('dotenv').config();

const app = express()

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("puplic"));

app.use(express.urlencoded({
    extented : true
}))

app.use(express.json())

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/", (req, res) => {

})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})