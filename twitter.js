var Twitter = require('twitter');
 
var client = new Twitter({
    consumer_key: 'LmNp3JwAQZnuBr4SQFaM7UZG3',
    consumer_secret: 'Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD',
    access_token_key: '151128859-F4Wk8KebqH4ZDwp8tMWY8PkoTQzfiEJrN1t2Knfc',
    access_token_secret: 'czQre16YZKoC4Csi18gGufu8PxF733aL5VnzbhurlGvHw'
});
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('7b6bf4773c39c9e271f6bd999fea5df5179a6dad');
var Twit = require('twit')

var T = new Twit({
   consumer_key: 'LmNp3JwAQZnuBr4SQFaM7UZG3',
    consumer_secret: 'Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD',
    access_token: '151128859-F4Wk8KebqH4ZDwp8tMWY8PkoTQzfiEJrN1t2Knfc',
    access_token_secret: 'czQre16YZKoC4Csi18gGufu8PxF733aL5VnzbhurlGvHw'
})

//to get followers list 
/*var params = {};
client.get('followers/list', params, function(error, tweets, response){
  if (!error) {
    console.log(tweets);
  }
});*/

//for streaming track by keyword

   /*
client.stream('statuses/filter', {track: 'federer'}, function(stream) {
  stream.on('data', function(tweet) {
    console.log(tweet.text);
    console.log(tweet.location);
    console.log(tweet);

     alchemy.keywords(tweet.text, {}, function(err, response) {
  		if (err) throw err;

  		// See http://www.alchemyapi.com/api/keyword/htmlc.html for format of returned object
  		var keywords = response.keywords;
		console.log('keywords');
  			console.log(keywords);
 		 // Do something with data
		});
 		 });
 
  stream.on('error', function(error) {
  	console.log(error);
    throw error;
  });
});*/

//to track by location
var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ]

var stream = T.stream('statuses/filter', {locations:sanFrancisco})

stream.on('tweet', function (tweet) {
	var x=tweet.text.toString().toLowerCase();
	if(x.indexOf("ca") > -1){
		console.log('*****************');
  console.log(tweet);
  console.log(tweet.text);
  		console.log('*****************');
  }
  else{
  	//console.log(tweet.text);
  }
})

