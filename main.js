

array.forEach(Input => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = req.body.videoID.match(regExp);
    const videoID = (match&&match[7].length==11)? match[7] : false
    
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
        url: `https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`,
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY,
            'X-RapidAPI-Host': process.env.API_HOST
        }
        };
        console.log(options);
        axios.request(options).then(function (response) {
            console.log(response.data);
            return res.render("index", {success : true, song_title: response.data.title, 
                song_link : response.data.link});
        }).catch(function (error) {
            return res.render("index", {success : false, message : error});
        });
    }    
});
