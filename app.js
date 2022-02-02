require("dotenv").config();
const express = require("express");
const https = require("https");


const app = express();
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});

app.post("/", function(req, res){
    console.log(req.body.cityName);

    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const units = "imperial"
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + units + "&appid=" + apiKey;

    https.get(url, function(response){
        if(response.statusCode == 404) {
            res.send("Invalid City Name");
        }
        else {
            response.on("data", function(data) {
                const weatherData = JSON.parse(data);
            
                const temp = weatherData.main.temp;

                const weatherDescription = weatherData.weather[0].description;

                const icon = weatherData.weather[0].icon;

                res.write("<h1>Temperature in " + weatherData.name + " is " + temp + "f</h1>");
                res.write("<h1>The weather is " + weatherDescription + "</h1>");
                res.write("<img src='http://openweathermap.org/img/wn/" + icon + "@2x.png' alt='weather-icon'>");
                res.send();
            });
        }
    });
});



app.listen('3000', function(){
    console.log("server is running");
});