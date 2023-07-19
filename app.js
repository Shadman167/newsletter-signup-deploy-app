//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";

import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    var data = {
        members: [
            {email_address: email,
            status:"subscribed",
            "merge_fields":{"FNAME": firstName,
            "LNAME" :lastName}
        }
        ]
    };

    var jsonData = JSON.stringify(data);
    const url = "https://us10.api.mailchimp.com/3.0/lists/379e2a0d0c";
    const options = {
        method: "POST",
        auth: "shadman12:b5c1ab2a5c35e7aa04ab14b9ebc3012e-us10"
    };
    const request = https.request(url, options, function(response){
        
        if (response.statusCode === 200){

            res.sendFile(__dirname+"/success.html");
            
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();
});

app.post("/backToMain", function (req,res){
    res.redirect('/');
  });



//API Key
//b5c1ab2a5c35e7aa04ab14b9ebc3012e-us10
//List Id
// 379e2a0d0c

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});