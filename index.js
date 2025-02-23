const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const image = fs.readFileSync("images/as_te2.jpg", {
    encoding: "base64"
});

axios({
    method: "POST",
    url: process.env.URL,
    params: {
        api_key: process.env.API_KEY
    },
    data: image,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})
.then(function(response) {
    console.log(response.data);
    if(response.data.predictions.length > 1){
        console.log('Elephant Detected');
    }else{
        console.log("Not a Elephant")
    }
})
.catch(function(error) {
    console.log(error.message);
});