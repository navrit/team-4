var CronJob     = require('cron').CronJob;
var express     = require('express');

var app         = express();
var server      = require('http').Server(app);
var io          = require('socket.io')(server);
var request     = require('superagent');

var port = process.port || 8080;

server.listen(port, function() {
    console.log("Server Live");
});

app.use(express.static(__dirname + '/static'))
app.use('*', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

var newData;
io.on('connection', function (socket) {
    console.log("Connection!");

    request
        .get('http://ec2-54-78-230-185.eu-west-1.compute.amazonaws.com:8080/query')
        .end(function(err, res) {
            if (err) {
                console.error(err);
            } else {
                socket.emit('data', res.text);
            }
        });
});

new CronJob('*/5 * * * * *', function() {
    if (io.sockets.sockets.length > 0) {
        var date = new Date().toISOString();
        var dateSplit = date.split('T')
        dateSplit[1] = dateSplit[1].split('.')[0];

        request
            .get('http://ec2-54-78-230-185.eu-west-1.compute.amazonaws.com:8080/query')
            .end(function(err, res) {
                if (err) {
                    console.error(err);
                } else {
                    io.emit('update', res.text);
                }
            });
    }
}, null, true, 'Europe/London');
