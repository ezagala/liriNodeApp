require("dotenv").config();
var keys = require('./keys'); 
var Spotify = require('node-spotify-api'); 
var Twitter = require('twitter'); 
var inquirer = require('inquirer'); 
var request = require('request');
var fs = require('fs');


var spotifyClient = new Spotify(keys.spotify);
var twitterClient = new Twitter(keys.twitter);

var appLogic = function(y) {

    switch(y.command || y) {
        case 'My Tweets':
            var params = {screen_name: 'EJZagala'};
            twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (!error) {
                    for (var i = 0; i < 20; i++) {
                    console.log('Date tweeted: ' + tweets[i].created_at);
                    console.log('Tweet text: ' + tweets[i].text + '\n')
                    }
                }
            });
        break; 
        case "Spotify this song...": 
            inquirer.prompt([
                {
                    name: "songName",
                    message: "What song would you like to look up?"
                }
            ]).then(function(x){
                spotifyClient
                    .search({ type: 'track', query: x.songName})
                    .then(function(response) {
                        console.log(response);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            })
        break; 
        case "Movie this!":
            inquirer.prompt([
                {
                    name: "movieName", 
                    message: "What movie would you like to search?"
                }
            ]).then(function(x){
                var space = / /gi;
                var nameParam = x.movieName.replace(space, '+'); 
                var queryURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + nameParam;     

                request(queryURL, function(error, response){
                    if (error){
                        return console.log(error); 
                    }
                    // console.log(response.body);
                    movieInfo = JSON.parse(response.body); 
                    // console.log(movieInfo);
                    console.log(`
                    Title: ${movieInfo.Title}
                    Release year: ${movieInfo.Year}
                    IMDB rating: ${movieInfo.imdbRating}
                    Rotten Tomatoes rating: ${movieInfo.Ratings[1].Value}
                    Country(ies) produced in: ${movieInfo.Country}
                    Language: ${movieInfo.Language}
                    Plot: ${movieInfo.Plot}
                    Actors: ${movieInfo.Actors}
                    `) 
                })

            })
        break; 
        case "Do what it says": 
            fs.readFile('random.txt', function(err, data){
                if (err) {
                    console.log(err)
                }; 
                var command = data.toString(); 
                appLogic(command); 
            })
        break; 
    }
}

inquirer.prompt([
{
    name: "command", 
    message: "What command would you like to run?", 
    type: "rawlist",
    choices: ["My Tweets", "Spotify this song...", "Movie this!", "Do what it says"]
}
]).then(function(x){

    appLogic(x); 

})
