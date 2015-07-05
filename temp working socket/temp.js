var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var Twitter = require('twitter');
var client = new Twitter({
    consumer_key: 'LmNp3JwAQZnuBr4SQFaM7UZG3',
    consumer_secret: 'Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD',
    access_token_key: '151128859-F4Wk8KebqH4ZDwp8tMWY8PkoTQzfiEJrN1t2Knfc',
    access_token_secret: 'czQre16YZKoC4Csi18gGufu8PxF733aL5VnzbhurlGvHw'
});
server.listen(1337, '127.0.0.1', function() {

    // print a message when the server starts listening
    console.log("server starting on " );
});

app.get('/', function (req, res) {
  console.log('interrupted');
  res.end('asd' );
});
var x=0;



        

 


io.on('connection', function (socket) {
  x=0;
console.log('connected');
    client.stream('statuses/filter', {
        track: '#4thofJuly'
    }, function(stream) {
        stream.on('data', function(tweet) {
          if(x<20){
  		    x++;
          console.log(tweet.text);
          socket.emit('news', { hello: tweet.text });
          }
          else{
            socket.disconnect();
            //stream.end();
          }
           
        });

});
    io.on('error', function(error) {
   console.log('The error: '+error);
   //...
});
});