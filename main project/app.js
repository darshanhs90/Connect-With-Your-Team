/*jshint node:true*/
//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------
// This application uses express as it's web server
// for more info, see: http://expressjs.com
var express = require('express');
var request = require('request');
var https = require('https');
var http=require('http');
var cors = require('cors');
var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: 'LmNp3JwAQZnuBr4SQFaM7UZG3',
    consumer_secret: 'Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD',
    access_token_key: '151128859-F4Wk8KebqH4ZDwp8tMWY8PkoTQzfiEJrN1t2Knfc',
    access_token_secret: 'czQre16YZKoC4Csi18gGufu8PxF733aL5VnzbhurlGvHw'
});
var watson = require('watson-developer-cloud');
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI('7b6bf4773c39c9e271f6bd999fea5df5179a6dad');
var sendgrid = require('sendgrid')('hsdars', 'Password90-');
var accountSid = 'AC07275e4294f1b0d42623c3ec9559911e';
var authToken = '650d049a9bd99323fb899ce4b9e84fcc';
var clientTwilio = require('twilio')(accountSid, authToken);




// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
app.use(cors());
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {
//app.listen(1337, '127.0.0.1', function() {

    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});





//analyse company score in twitter passing tweet to ibm sentiment analyser
app.use('/twitterCompanySentiment', function(reqst, respns) {

    //get companyname from request
    var companyName=reqst.query.companyName;
    client.get('search/tweets', {
        q: companyName
    }, function(error, tweets, response) {

        var length = (tweets.statuses.length);
        console.log(length);
        var total = 0;
        var count = 0;

        (tweets.statuses).forEach(function(e) {
            var text = e.text;

            console.log('text is '+text);
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
                    count=count+1;
                    console.log(count);
                if(typeof(sentiment)!=="undefined"){
                if(typeof(sentiment.score)!=="undefined"){
                    total =total+ parseFloat(sentiment.score);
                console.log('total is '+total);
                if(total>1||total<-1)
                    respns.end(total.toString());
                }
                }
                //}
            });
            });
        
    });
});

app.get('/twitterInsight',function(reqst,respns){
var val=reqst.query.val;
http.get('http://nexruiter.webuda.com/retrieve.php',
        function(response){
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {

               
               // console.log(body);
                
                 var parsed = JSON.parse(body);
                 var textval=(parsed[val].rec_data);


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
        });

});


//company info
app.get('/companyInfo', function(reqst, respns) {
    //company website
    var companyName=reqst.query.companyName;
    console.log(companyName);
    https.get('https://api.fullcontact.com/v2/company/lookup.json?domain='+companyName+'.com&apiKey=f6e2b2695278badc',
        function(response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {

                // Data reception is done, do whatever with it!
                var parsed = JSON.parse(body);
                console.log('linkedin');
                respns.send(parsed);
            });

        });

});



//get student info
app.get('/personInfo', function(reqst, respns) {
    //person email id  
    var email=reqst.query.email;
    console.log(email);
    https.get('https://api.fullcontact.com/v2/person.json?email='+email+'&apiKey=f6e2b2695278badc',
        function(response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {

                // Data reception is done, do whatever with it!
                var parsed = JSON.parse(body);
                console.log(parsed);
                respns.send(parsed);
            });

        });

});

//get student info
app.get('/personalityInsights', function(reqst, respns) {
   var val=reqst.query.val;

http.get('http://nexruiter.webuda.com/retrieve.php',
        function(response){
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {

               
               // console.log(body);
                
                 var parsed = JSON.parse(body);
                 var textval=(parsed[val].rec_data);
                 

   var personality_insights = watson.personality_insights({
                                                "username": "51397aaa-2786-4342-9cb7-40f1225de1a7",
                                                "password": "ufQQJaVROpjw",
                                                version: 'v2'
                                            });

                                            personality_insights.profile({
                                                    text: textval
                                                },
                                                function(err, response) {
                                                    if (err)
                                                        console.log('error:', err);
                                                    else{
                                                        var output=(JSON.stringify(response, null, 2));
                                                        respns.end(output);
                                                    }
                                                });
        });
    });



});


//get student info
app.get('/getCompInfo', function(reqst, respns) {
    var companyName=reqst.query.companyName;
    console.log(companyName);
    var tickrsymbol='';
//get tickr symbol
http.get('http://d.yimg.com/autoc.finance.yahoo.com/autoc?query='+companyName+'&callback=YAHOO.Finance.SymbolSuggest.ssCallback',
        function(response){
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {

                // Data reception is done, do whatever with it!
                //var parsed = JSON.parse(body);
                console.log(body);
                data=body
    var string=data.substring(39);
    string=string.split('').reverse().join('');
    string=string.substring(1);
    //console.log(string);
    string=string.split('').reverse().join('');
    string=(JSON.parse(string));
    console.log(string);
    if(string.ResultSet.Result.length==0)
        respns.end('Invalid Tickr Symbol');
    else{
        companyName=(string.ResultSet.Result[0].symbol);



https.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20=%22' + companyName + '%22&format=json&env=http%3A%2F%2Fdatatables.org%2Falltables.env'
    , function (response) {
        var rawData = '';
        
        response.on('data', function(chunk) {
            rawData += chunk;
            console.log(rawData);
        });

        response.on('end', function() {
                // parse as JSON
 
              respns.end(rawData);

            });
                
            
        });

    }
});

});


});




