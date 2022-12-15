
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


app.post("/convert-mp3", async (req, res) => {
    const videoID = req.body.videoID;
    
    if (videoID === "undefined" ||
        videoID === "" ||
        videoID === null)
    {
        return res.render("index", {success : false, message: "Please enter a videoID"});
    }
    else
    {   
        console.log("Started convert-func")
        const axios = require("axios");

        const options = {
        method: 'GET',
        url: 'https://youtube-mp36.p.rapidapi.com/dl',
        params: {id: 'ZoE7uopwC8o'},
        headers: {
            'X-RapidAPI-Key': '6776d134femsh9407f1420c6ad00p1efda9jsna8b4e644ab77',
            'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        }
        };

        axios.request(options).then(function (response) {
            console.log(response.data);
            const fetchResponse = response.data
            return res.render("index", {success : true, song_title: fetchResponse.title, 
                song_link : fetchResponse.link});
        }).catch(function (error) {
            return res.render("index", {success : false, message: fetchResponse.msg});
        });
    }
})

// app.post("/convert-mp3", async (req, res) => {
//     const videoID = req.body.videoID;
    
//     if (videoID === "undefined" ||
//         videoID === "" ||
//         videoID === null)
//     {
//         return res.render("index", {success : false, message: "Please enter a videoID"});
//     }
//     else
//     {   
//         const url = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`
//         const fetchAPI = await fetch(url, {
//             "method" : "GET",
//             "headers" : {
//                 "x-rapidapi-key" : "process.env.API_KEY",
//                 "x-rapidapi-host" : "process.env.HOST_KEY"
//             }
//         })
    

//         const fetchResponse = await fetchAPI.json();

//         console.log(fetchResponse)

//         if (fetchResponse === "ok")
//             return res.render("index", {success : true, song_title: fetchResponse.title, 
//             song_link : fetchResponse.link});
//         else 
//             return res.render("index", {success : false, message: fetchResponse.msg});
//     }
// })

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})