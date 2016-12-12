var express = require('express');
var request = require('request');
var api = require('./routes/api');

var app = express();

app.use('/api', api);
app.set('port', 3000);
app.use('/', express.static(__dirname + '/www'));

var server = app.listen(app.get('port'), function () {
    console.log('Server is up on port ' + server.address().port);
});