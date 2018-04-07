require("dotenv").config();
require("./package-lock.json")

var keys = require("./keys.js"); 

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

console.log(process.argv)

