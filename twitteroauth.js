var OAuth = require('oauth').OAuth
  , oauth = new OAuth(
      "https://api.twitter.com/oauth/request_token",
      "https://api.twitter.com/oauth/access_token",
      "LmNp3JwAQZnuBr4SQFaM7UZG3",
      "Xps6ziqIhZ0exAPoIAeyqj7myu7L78ZLHQDni67dzD9koJQTAD",
      "1.0",
      "oob",
      "HMAC-SHA1"
    );
  var xoauth;
var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors());

  app.get('/auth/twitter', function(req, res) {
 
  oauth.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results) {
    if (error) {
      console.log(error);
      res.send("Authentication Failed!");
    }
    else {
      xoauth = {
        token: oauth_token,
        token_secret: oauth_token_secret
      };
      console.log(xoauth);
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
    }
  });
 
});


  app.get('/auth/twitter/callback', function(req, res, next) {
 
  if (xoauth) {
    xoauth.verifier = 5744204;//req.query.oauth_verifier;
    var oauth_data = xoauth;
 
    oauth.getOAuthAccessToken(
      oauth_data.token,
      oauth_data.token_secret,
      oauth_data.verifier,
      function(error, oauth_access_token, oauth_access_token_secret, results) {
        if (error) {
          console.log(error);
          res.send("Authentication Failure!");
        }
        else {
          xoauth.access_token = oauth_access_token;
          xoauth.access_token_secret = oauth_access_token_secret;
          console.log(results, req.session.oauth);
          console.log('token');

          console.log(oauth_access_token);
                    console.log('token secret');
			console.log(oauth_access_token_secret);



          res.send("Authentication Successful");
          // res.redirect('/'); // You might actually want to redirect!
        }
      }
    );
  }
  else {
    res.redirect('/login'); // Redirect to login page
  }
 
});



app.listen(1337, '127.0.0.1', function() {

    // print a message when the server starts listening
    console.log("server starting on ");
});