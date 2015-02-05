var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = process.env.PORT || 8080;

// Keep track of chats
var chats = [
  {
    username: 'system',
    message: 'Welcome to the chat app!'
  }
];

// Handle socket connections
io.on('connection', function(socket) {
  console.log('connected!');

  // Sends out chats when connected
  socket.emit('chats', {
    data: chats
  });

  // Accepts new chats
  socket.on('submit', function(data) {
    var chat = data.data;
    chats.push(chat);

    // Inform ALL sockets of the new chat
    io.sockets.emit('newChat', {
      data: chat
    });
  });
});

app.use(express.static(__dirname + '/public'));

app.get('/chats', function(req, res) {
  res.json({
    data: chats
  });
});

var serverInfo = server.listen(port, function() {
  var h = serverInfo.address().address;
  var p = serverInfo.address().port;
  console.log('Group chat server listening at http://%s:%s', h, p);
});
