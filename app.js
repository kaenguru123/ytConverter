const { response } = require("express");
const express = require("express");
const fetch = require("node-fetch");
require('dotenv').config();
const axios = require("axios");
const request = require('request');
const fs = require('fs');

function downloadMP3(url, destDir, title, i) {
    // path = "C:\\Users\\Startklar\\Desktop\\musik\\Genres\\" + title + ".mp3";
    path = `C:\\Users\\Startklar\\Downloads\\${destDir}\\${title}.mp3`;
    request(url)
    .pipe(fs.createWriteStream(path))
    .on('close', () => {
    console.log(`File ${title} has been downloaded. ${i}`);
  });
}

function getYtId(input){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = input.match(regExp);
    return (match&&match[7].length==11)? match[7] : false
}

function getAxiosOption(vIDOrUrl){
    return {
        method: 'GET',
        url: `https://youtube-mp36.p.rapidapi.com/dl?id=${vIDOrUrl}`,
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY,
            'X-RapidAPI-Host': process.env.API_HOST
        }
    };
}

function makeAxiosReqest(res, options){
    axios.request(options)
        .then(function (response) {
            return res.render("index", {success : true, song_title: response.data.title, song_link : response.data.link});
        })
        .catch(function (error) {
            return res.render("index", {success : false, message : error});
        });
}

function makeAxiosReqestAndDownload(options, destDir, iteration){
    axios.request(options).then(function (response) {
        downloadMP3(response.data.link, destDir, response.data.title, iteration);
        })
}

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

app.post("/upload-file", (req, res) => {
    destinationDirectiory = req.body.destinationDirectory;

    (async () => {
        const data = await fs.promises.readFile("C:\\Users\\Startklar\\Documents\\Git_Repos\\ytConverter\\urls.txt", 'utf8');
        console.log(data)
        if (data == null){ return; }

        const content = data.split('\r\n');
        console.log(content)
        try{
            for (let i = 0; i < content.length; ++i){
                const url = content[i];
                console.log(url + `loop ${i}`)
                const ID = getYtId(url);
                const options = getAxiosOption(ID);
                console.log("make api request") 
                makeAxiosReqestAndDownload(options, destinationDirectiory, i)
            }
            return res.render("index", {success : true, message: "Finished Downloading", song_title: "test", song_link : "teset"});
        }
        catch{
            return res.render("index", {success : false, message: "Error in download loop"});
        }
      })();
})

app.post("/convert-mp3", async (req, res) => {
    const videoID = getYtId(req.body.videoID)
    console.log(videoID)
    if (videoID === "undefined" ||
        videoID === "" ||
        videoID === null)
    {
        return res.render("index", {success : false, message: "Please enter a videoID"});
    }
    else
    {   
        const options = getAxiosOption(videoID)
        console.log(options)
        return makeAxiosReqest(res, options)
    }
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})