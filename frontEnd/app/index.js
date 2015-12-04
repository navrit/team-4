var express     = require('express');

var app         = express();
var server      = require('http').Server(app);
var io          = require('socket.io')(server);

var port = process.port || 8080;

server.listen(port, function() {
    console.log("Server Live");
});

app.use('static', express.static(__dirname + '/static'))
app.use('*', function(req, res) {
    res.sendFile(__dirname + '/index.html')
});

io.on('connection', function (socket) {
    socket.emit('news', {
        hello: 'world'
    });

    socket.on('my other event', function (data) {
        console.log(data);
    });
});
