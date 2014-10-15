'use strict';

var express = require('express'),
    config = require('./config'),
    https = require('https'),
    cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser());
app.use('/app', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.redirect('https://github.com/login/oauth/authorize?client_id=1bcc10e2e4a14ae7d601&redirect_uri=http://gistable.io/callback&scope=gist&state=foo');
});

app.get('/status', function(req, res) {
    res.status(200).send('all ok at ' + Date.now());
});

app.get('/callback', function(req, res) {
    var code = req.query.code;

    var url = 'https://github.com/login/oauth/access_token?' +
        'client_id=' + config.github.clientId +
        '&client_secret=' + config.github.clientSecret +
        '&code=' + code;

    console.log('sending auth request to: ' + url);

    https.get(url, function(response) {
        var tokenAt;

        response.on('data', function(data) {
            data = data.toString();

            if ((tokenAt = data.indexOf('access_token=')) > -1) {
                var tokenStartsAt = tokenAt + 'access_token='.length;
                var token = data.substr(tokenStartsAt, 40);

                res.cookie('access_token', token, {
                    maxAge: 900000,
                    httpOnly: false
                });

                res.redirect('/app');
            } else {
                res.send(401).send('github authentication did not return a token');
            }
        });
    }).on('error', function(e) {
        res.status(401).send(e);
    });
});

app.listen(80);
