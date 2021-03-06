/*jshint node:true*/
//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------
// This application uses express as it's web server
// for more info, see: http://expressjs.com
var app = require('express')();
var express=require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ahttp = require('http');
//if (process.env.NODE_ENV !== 'production'){
var longjohn= require('longjohn');
//}
longjohn.async_trace_limit = -1;  // unlimited
var request = require('request');
var https = require('https');
var cors = require('cors');
var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: 'consumer_key',
    consumer_secret: 'consumer_secret',
    access_token_key: 'access_token_key',
    access_token_secret: 'access_token_secret'
});
var Twitter1 = require('node-tweet-stream'),
    tw = new Twitter1({
        consumer_key: 'consumer_key',
        consumer_secret: 'consumer_secret',
        token: 'token',
        token_secret: 'token_secret'
    });
var watson = require('watson-developer-cloud');
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('id');
var sendgrid = require('sendgrid')('id', 'pwd');
var accountSid = 'accountSid';
var authToken = 'authToken';
var clientTwilio = require('twilio')(accountSid, authToken);
var Twit = require('twit');
var sanFrancisco = ['-122.75', '36.8', '-121.75', '37.8']
var T = new Twit({
    consumer_key: 'consumer_key',
    consumer_secret: 'consumer_secret',
    access_token: 'access_token',
    access_token_secret: 'access_token_secret'
})

var OAuth = require('oauth').OAuth,
    oauth = new OAuth(
        "https://api.twitter.com/oauth/request_token",
        "https://api.twitter.com/oauth/access_token",
        "id",
        "token",
        "1.0",
        "oob",
        "HMAC-SHA1"
    );
var xoauth;

var Bing = require('node-bing-api')({
    accKey: "acckey"
});

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
app.use(cors());
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
server.listen(appEnv.port, appEnv.bind, function() {
//server.listen(1337, '127.0.0.1', function() {

    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});

var winner;
var retweeter;
var followersList='';
//login modules start
app.get('/auth/twitter', function(req, res) {

    oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
        if (error) {
            console.log(error);
            res.send("Authentication Failed!");
        } else {
            xoauth = {
                token: oauth_token,
                token_secret: oauth_token_secret
            };
            console.log(xoauth);
            //res.addHeader("Access-Control-Allow-Origin", "*");
            res.end('https://twitter.com/oauth/authenticate?oauth_token=' + oauth_token)
        }
    });

});


app.get('/auth/twitter/callback', function(req, res, next) {

    if (xoauth) {
        xoauth.verifier = req.query.code; //req.query.oauth_verifier;
        var oauth_data = xoauth;

        oauth.getOAuthAccessToken(
            oauth_data.token,
            oauth_data.token_secret,
            oauth_data.verifier,
            function(error, oauth_access_token, oauth_access_token_secret, results) {
                if (error) {
                    console.log(error);
                    res.end("Authentication Failure!");
                } else {
                    xoauth.access_token = oauth_access_token;
                    xoauth.access_token_secret = oauth_access_token_secret;
                    console.log(results, xoauth);
                    client = new Twitter({
                        consumer_key: 'consumer_key',
                        consumer_secret: 'consumer_secret',
                        access_token_key: oauth_access_token,
                        access_token_secret: oauth_access_token_secret
                    });

                    T = new Twit({
                        consumer_key: 'consumer_key',
                        consumer_secret: 'consumer_secret',
                        access_token: oauth_access_token,
                        access_token_secret: oauth_access_token_secret
                    })
                    tw = new Twitter1({
                        consumer_key: 'consumer_key',
                        consumer_secret: 'consumer_secret',
                        token: oauth_access_token,
                        token_secret: oauth_access_token_secret
                    });
                    console.log('token');
                    console.log(oauth_access_token);
                    console.log('token secret');
                    console.log(oauth_access_token_secret);
                    res.end("Authentication Successful");
                    // res.redirect('/'); // You might actually want to redirect!
                }
            }
        );
    } else {
        res.end("Authentication Failure"); // Redirect to login page
    }

});

//login modules end

//********************//
//stream tweets based on location and topic


app.get('/twit/stream', function(req, res) {
    var stream = T.stream('statuses/filter', {
        locations: sanFrancisco
    })

    stream.on('tweet', function(tweet) {
        var x = tweet.text.toString().toLowerCase();
        if (x.indexOf("ca") > -1) {
            console.log('*****************');
            console.log(tweet);
            console.log(tweet.text);
            console.log('*****************');
        } else {
            //console.log(tweet.text);
        }
    })
});
//****************//
//stream based on topic alone
app.get('/twitter/stream', function(req, res) {
    client.stream('statuses/filter', {
        track: 'federer'
    }, function(stream) {
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
    });
});
//****************//
//get followers list
app.get('/twitter/followers', function(req, res) {
    var location=req.query.address;
    var params = {};
    followersList=[];
    client.get('followers/list', params, function(error, tweets, response) {
        if (!error) {
            //console.log(tweets);
            var twt=(tweets.users);
            (twt).forEach(function(e) {
                var lcn=e.location;
                if(lcn='')
                    lcn='India';

                https.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + lcn + '&key=key',
                        function(response) {
                            var body = '';
                            response.on('data', function(d) {
                                body += d;
                            });
                            response.on('end', function() {
                                parsed = JSON.parse(body);
                               // console.log(parsed.status);
                                if (parsed.status == "OK") {
                                    var lengthnew = parsed.results[0].address_components.length;
                                    //console.log("********parsed**********");
                                    //console.log(parsed.results[0].address_components[0].long_name);
                                    if (parsed.results[0].address_components[lengthnew - 1].long_name == address) {
                                        followersList.push(e);
                                    }
                                }
                                else{
                                    console.log(e);
                                    followersList.push(e);
                                }
                            });

                        });
                });
             res.send(followersList);
            res.end();
            };
           
        });
    });


app.get('/getFollowersList',function(req,res){
    res.send(followersList);
    res.end();
})

app.get('/getFollowersList1',function(req,res){
    var params={};
client.get('followers/list', params, function(error, tweets, response) {
        if (!error) {
      followersList=tweets.users;
      res.send(followersList);
    res.end();
      }

    
});
});
//**************//
//get keywords
app.get('/tweet/keywords', function(req, res) {
    alchemy.keywords('', {}, function(err, response) {
        if (err) throw err;

        // See http://www.alchemyapi.com/api/keyword/htmlc.html for format of returned object
        var keywords = response.keywords;
        res.end(keywords);
        // Do something with data
    });
});
//*************//
//Bing search

//news search
// Bing.news("RCB", {
//     top: 10,  // Number of results (max 50) 
//     skip: 3,   // Skip first 3 results 
//     newssortby: "Date", //Choices are: Date, Relevance 
//     newscategory: "rt_Sports" // Choices are: 
//                                 //   rt_Business 
//                                 //   rt_Entertainment 
//                                 //   rt_Health 
//                                 //   rt_Politics 
//                                 //   rt_Sports 
//                                 //   rt_US 
//                                 //   rt_World 
//                                 //   rt_ScienceAndTechnology 
//   }, function(error, res, body){
//     console.log(body.d.results[3]);
//   });

//composite search
// Bing.composite("xbox", {
//     top: 10,  // Number of results (max 50) 
//     skip: 3,   // Skip first 3 results 
//     sources: "web+news", //Choises are web+image+video+news+spell 
//     newssortby: "Date" //Choices are Date, Relevance 
//   }, function(error, res, body){
//     console.log(body);
//   });

//video search
// Bing.video("monkey vs frog", {
//     top: 10,  // Number of results (max 50) 
//     skip: 3,   // Skip first 3 result 
//     videofilters: {
//       duration: 'short',
//       resolution: 'high'
//     }
//   }, function(error, res, body){
//     console.log(body);
//   });


//images search
// Bing.images("Ninja Turtles", {skip: 50}, function(error, res, body){
//   console.log(body);
// });  

//**********************//




app.use('/twitterSentiment', function(reqst, respns) {

    //get companyname from request
    var companyName = reqst.query.companyName;
    client.get('search/tweets', {
        q: companyName
    }, function(error, tweets, response) {

        var length = (tweets.statuses.length);
        console.log(length);
        var total = 0;
        var count = 0;

        (tweets.statuses).forEach(function(e) {
            var text = e.text;

           // console.log('text is ' + text);
            //if(count<15)
            alchemy.sentiment(text, {}, function(err, response) {
                if (err)
                    throw err;
                var sentiment = response.docSentiment;
                console.log('sentiment is ');
                console.log(sentiment);
                //asd=sentiment;
                //res.send(asd);
                //if(!isNaN(sentiment)){
                count = count + 1;
                console.log(count);
                if (typeof(sentiment) !== "undefined") {
                    if (typeof(sentiment.score) !== "undefined") {
                        total = total + parseFloat(sentiment.score);
                        console.log('total is ' + total);
                        if (total > 1 || total < -1)
                            respns.end(total.toString());
                    }
                }
            });
        });

    });
});

app.get('/twitterInsight', function(reqst, respns) {


    alchemy.sentiment(textval, {}, function(err, response) {
        if (err)
            throw err;
        var sentiment = response.docSentiment;
        console.log(sentiment);
        //asd=sentiment;
        //res.send(asd);
        respns.end(JSON.stringify(sentiment));
    });

});

app.get('/getSuggestions', function(reqst, respns) {
    locn=0;
    client.get('users/suggestions/sports.json', function(error, tweets, response) {

        //console.log(tweets);
        //respns.end(JSON.parse(tweets));
        respns.send(tweets);
        respns.end();
    });
});

var locn = false;
var address = '';
app.get('/updatelatlng', function(req, res) {
    address = req.query.address;
    console.log(address);
    locn = 1;
    res.end('1');
});
var stream;
var score=0;
app.get('/getScore', function(req, res) {
    address = req.query.address;
    console.log(address);
    console.log('in get score');
    locn = 2;
    console.log(score);
    var temp=score;
    score=0;
    console.log(temp);
    if(temp==0)
        temp=Math.random()*10;
    console.log(temp);
    res.send({'score':temp});
    res.end();
});

app.get('/getWinner',function(req,res){

res.send(winner);
res.end();
});


app.get('/getsentimentWinner',function(req,res){

res.send(sentimentWinner);
res.end();
});

app.get('/getretweetWinner',function(req,res){

res.send(retweetWinner);
res.end();
});

app.get('/getrandomWinner',function(req,res){

res.send(randomWinner);
res.end();
});

var timeline='';

app.get('/timeline',function(req,res){

var params = {screen_name: 'rcbtweets'};
client.get('statuses/user_timeline', params, function(error, tweets, response){
  if (!error) {
    console.log(tweets);
    timeline=tweets;
    res.send(tweets);
    res.end();
  }
});

})

app.get('/news',function(req,respns){

 var val=req.query.val;
 var tweet=timeline[val].text.toString();

  alchemy.keywords(tweet, {}, function(err, response) {
        if (err) throw err;

        // See http://www.alchemyapi.com/api/keyword/htmlc.html for format of returned object
        var keywords = response.keywords;
        console.log(keywords);
        if(keywords==undefined||keywords.length>1)
            keywords='Royal challengers Bangalore';
        Bing.news(keywords, {
    top: 10,  // Number of results (max 50) 
    skip: 3,   // Skip first 3 results 
    newssortby: "Date", //Choices are: Date, Relevance 
    newscategory: "rt_Sports" // Choices are: 
                                //   rt_Business 
                                //   rt_Entertainment 
                                //   rt_Health 
                                //   rt_Politics 
                                //   rt_Sports 
                                //   rt_US 
                                //   rt_World 
                                //   rt_ScienceAndTechnology 
  }, function(error, res, body){
   // console.log(body.d.results);
    respns.send(body.d.results);
    respns.end();
  });
        // Do something with data
    });
})

app.get('/images',function(reqst,respns){

Bing.images("Royal challengers Bangalore", {skip: 10}, function(error, res, body){
  console.log(body);
  respns.send(body.d.results);
  respns.end();
});  
});


app.get('/videos',function(reqst,respns){
Bing.web("Royal challengers Bangalore", {
    top: 10,  // Number of results (max 50)
    skip: 3,   // Skip first 3 results
  }, function(error, res, body){
    console.log(body);
    respns.send(body.d.results);
    respns.end();
  });



});



app.get('/postUpdate',function(req,res){
    var stat=req.query.status;
    console.log(req.query);
    client.post('statuses/update', {status: stat},  function(error, tweet, response){
  if(error) throw error;
 // console.log(tweet);  // Tweet body. 
  //console.log(response);  // Raw response object. 
  res.send('1');
  res.end();
});
})

var prevRetweet=0;
var prevSentiment=0;
var sentimentWinner;
var retweetWinner;
var randomWinner;
io.on('connection', function(socket) {
    x = 0;
    console.log('connected');
    socket.emit('connection1', {
        asd: 'asd'
    });
    socket.on('dashboard', function(data) {
        console.log('dashboard');
        tw.track('#twitter');
        tw.on('tweet', function(tweet) {
            //console.log(tweet.text);
            if(tweet.text.indexOf('answer')>0)
                winner=tweet;
            if(tweet.retweet_count>=prevRetweet)
            {
                retweetWinner=tweet;
                prevRetweet=tweet.retweet_count;
            }
            //text='hi how are you doind'
            var txtval=tweet.text;
           // console.log(tweet.text);
             alchemy.sentiment(txtval, {}, function(err, response) {
            if (err)
                throw err;
            var sentiment = response.docSentiment;
           // console.log(sentiment);
            if(sentiment!=undefined && sentiment.score!=undefined && parseFloat(sentiment.score)>=prevSentiment)
            {
                prevSentiment=parseFloat(sentiment.score);
                sentimentWinner=tweet;
            }
            else{
                sentimentWinner=tweet;
            }
           });

             if(x%21==0)
             {
                randomWinner=tweet;
             }
             x++;

             if(tweet.text.indexOf("help")>1){

                var tweetId = tweet.id;
                client.post('statuses/retweet/' + tweetId, function(error, tweet, response){
                if (!error) {
                    console.log('retweeted');
                    console.log(tweet);
                     }
                });
             }
             if(tweet.text.indexOf("question")>1){

                var tweetId = tweet.user.screen_name;
                var stat="@"+tweetId+' .Thanks for the Question.Your question will be answered shortly';
                client.post('statuses/update', {status: stat},  function(error, tweet, response){
                if(error) throw error;
                     // console.log(tweet);  // Tweet body. 
                     //console.log(response);  // Raw response object. 
 
                });
             }



            if (locn == 0) {
                //x++;
                //console.log(tweet.text);
                socket.emit('news', {
                    hello: tweet
                });
            } else if (locn == 1) {
                var addr = address;
                var parsed;
                if (tweet.place != null || tweet.user.location != '') {
                    //console.log("******************");
                   
                    // console.log(address);
                    // console.log("******************");
                    // console.log(tweet.user.location);
                    https.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + tweet.user.location + '&key=key',
                        function(response) {
                            var body = '';
                            response.on('data', function(d) {
                                body += d;
                            });
                            response.on('end', function() {
                                parsed = JSON.parse(body);
                                //console.log(parsed.status);
                                if (parsed.status == "OK") {
                                    var lengthnew = parsed.results[0].address_components.length;
                                    //console.log("********parsed**********");
                                    //console.log(parsed.results[0].address_components[0].long_name);
                                    if (parsed.results[0].address_components[lengthnew - 1].long_name == address) {
                                        socket.emit('news', {
                                            hello: tweet
                                        });
                                    }
                                    else{
                                        socket.emit('news', {
                                            hello: tweet
                                        });
                                    }
                                }
                                else{
                                    socket.emit('news', {
                                            hello: tweet
                                        });
                                }
                            });

                        });



                }
                //var tweet_addr=tweet.
                //get address from tweet
                //if this address lies in the specified adress,then tweet it

                //stream.stop();
                // tw.untrack('#wimbledon');
                // tw.track("India");
                // console.log('changed******************');
                // x = 0;
            }
            else if(locn==2)
            {
                //console.log('in 2');
                var addr = address;
                var parsed;
                if (tweet.place != null || tweet.user.location != '') {
                    https.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + tweet.user.location + '&key=key',
                        function(response) {
                            var body = '';
                            response.on('data', function(d) {
                                body += d;
                            });
                            response.on('end', function() {
                                parsed = JSON.parse(body);
                                //console.log(parsed.status);
                                if (parsed.status == "OK") {
                                    var lengthnew = parsed.results[0].address_components.length;
                                    if (parsed.results[0].address_components[lengthnew - 1].long_name == address) {
                                        //alchemy here
                                        //update the score
                                         alchemy.sentiment(tweet.text, {}, function(err, response) {
                                        if (err)
                                            throw err;
                                         var sentiment = response.docSentiment;
                                        score=score+parseFloat(sentiment);
                                    });
                                    }
                                }
                            });

                        });



                }


            }






        });

        tw.on('error', function(err) {
            console.log('Oh no')
        });
    });



    tw.on('error', function(err) {
        console.log('Oh no')
    })
});




io.on('error', function(error) {
    console.log('The error: ' + error);
    //...
});
