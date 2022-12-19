const { response } = require("express");
const express = require("express");
const fetch = require("node-fetch");
require('dotenv').config();
const axios = require("axios");
const fs = require('fs');

function makeToList(text){
    return 
}

function getYtId(input){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = input.match(regExp);
    return (match&&match[7].length==11)? match[7] : false
}

function getAxiosOption(vIDOrUrl, onlyId = true){
    console.log("inside option generation")
    if (onlyId) {
        return {
            method: 'GET',
            url: `https://youtube-mp36.p.rapidapi.com/dl?id=${vIDOrUrl}`,
            headers: {
                'X-RapidAPI-Key': process.env.API_KEY,
                'X-RapidAPI-Host': process.env.API_HOST
            }};
        }
    else {
        return {
            method: 'GET',
            url: `${vIDOrUrl}`,
            // headers: {
            //     'X-RapidAPI-Key': process.env.API_KEY,
            //     'X-RapidAPI-Host': process.env.API_HOST
            // }
        };
    } 
}

function makeAxiosReqest(res, options){
    axios.request(options).then(function (response) {
        return res.render("index", {success : true, song_title: response.data.title, 
            song_link : response.data.link});
        }).catch(function (error) {
            return res.render("index", {success : false, message : error});
        });
}

function makeAxiosReqestAndDownload(res, options){
    axios.request(options).then(function (response) {
        options = getAxiosOption(response.data.link, onlyId = false);
        console.log("make download request" + response.data.link)
        axios.request(options);
        }).catch(function (error) {
            return res.render("index", {success : false, message : error});
        });
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
    path = req.body.filePath.replace(/\\/g, "/");
    console.log(path);

    let content = null;

    (() => {
        const data = fs.promises.readFile(path, 'utf8');
        console.log(data)
        content = data.body.split('\r\n');;

        for (let i = 0; i < content.length; ++i){
            const url = content[i];
            console.log(url + `loop ${i}`)
            const ID = getYtId(url);
            const options = getAxiosOption(ID);
            console.log("make api request")
            makeAxiosReqestAndDownload(res, options);
        }
        // content.forEach(url => {
        //     console.log(url + `loop ${cnt}`)
        //     cnt = cnt + 1
        //     const ID = getYtId(url);
        //     const options = getAxiosOption(ID);
        //     console.log("make api request")
        //     makeAxiosReqestAndDownload(res, options);
        // });
      })();
    return res.render("index", );
})

app.post("/convert-mp3", async (req, res) => {
    const videoID = getYtId(req.body.videoID)
    
    if (videoID === "undefined" ||
        videoID === "" ||
        videoID === null)
    {
        return res.render("index", {success : false, message: "Please enter a videoID"});
    }
    else
    {   
        const options = getAxiosOption(videoID)
        return makeAxiosReqest(res, options)
    }
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})