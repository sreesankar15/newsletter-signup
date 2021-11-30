// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.post("/", function (req, res) {
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };
    const JSONData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/689894e0c8";

    const options = {
        method: "POST",
        auth: "sreesankar15:96c07958ab853297dc6467b9826fc247-us20"
    };

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 400) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(JSONData);
    request.end();

});







app.listen(process.env.PORT || 3000, function () {
    console.log("Server running on port 3000");
});

//API Key
//96c07958ab853297dc6467b9826fc247-us20

//List Id
//689894e0c8