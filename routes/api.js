var express = require('express');
var request = require('request');
var router = express.Router();
var app = express();


var url = 'https://developer.api.autodesk.com/authentication/v1/authenticate';

var credentials = {
    client_id: 'V7qA7CAs4XAi7R7N6TwABanGhYE78OQA',
    client_secret: 'aNE22BTGNZx3K2YZ',
    grant_type: 'client_credentials',
    scope: 'data:read',
    callbackUrl: ''
};


router.get('/token', function (req, res) {
    request.post(url, { form: credentials }, function (error, response, body){
        if (!error && response.statusCode == 200) {
            res.send(JSON.parse(body).access_token);
            console.log('Token generated successfully!');
        } else {
            console.log('Error generating token!');
        }
    });
});

module.exports = router;