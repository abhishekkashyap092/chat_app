var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom ={};

exports.listen =function(server) {
	io = socketio.listen(server);
	io.set('log level', 1);
	
	io.sockets.on ('connection' function (socket) {
		guestNumber = assignGuestName(socket, guestNumber,nickNames,namesUsed);
		joinRoom(socket, 'Lobby');
		
		handleMessageBroadcasting(socket, nickNames);
		handleNameChangeAttempts(socket, nickNames, namesUsed);
		handleRoomJoining(socket);
		
		socket.on('rooms', io.sockets.manager.rooms);
	});
	handleClientDisconnection(socket, nickNames, namesUsed);
});
};
//assigning guest names

function assignGuestname(socket, guestNumber, nickNames, namesUsed) {
	var name = 'Guest' + guestNumber;
	nickNames[socket.id] = name;
	socket.emit('nameResult', {
		success:true,
		name: name
	});
	nameeUsed.push(name);
	return guestNumber + 1;
}
//joining room logic
function joinRoom(socket, room) {
	socket.join(room);
	currentRoom[socket.id] = room;
	socket.emit('joinResult', {room: room});
	socket.broadcast.to(room.emit('message', {
		text:nickNames[socket.id] + 'has joined' + room + '.' });
		
		var userInRoom = io.sockets.clients(room);
		if (usersInRoomSummary = 'Users currently in ' + room + ': ';
 for (var index in usersInRoom) {
	 var userSocketId = usersInRoom[index].id;
	 if (userSocketId != socket.id) {
		 if (index > 0) {
			 usersInRoomSummary += ', ';
		 }
		 usersInRoomSummary += nickNames[userSocketId];
	 }
 }
		usersInRoomSummary += '.';
		socket.emit('message',{text: usersInroomSummary});
}
}
	//name change option
	function handleNameChangeAttempts(socket, nickNames, namesUsed) {
		socket.on('nameAttempt', function(name) {
			if (name.indexof('Guest')== 0 ) {
				socket.emit('nameResult', {
					success: false,
					message: 'Name cannot begin with "Guest".'
				});
			} else {
				if (namesUsed.indexof(name) == -1) {
					var previousName = nickNames[socket.id];
					var previousNameIndex = namesUsed.indexof(previousName);
					namesUsed.push(name);
					nickNames[socket.id] = name;
					delete namesUsed[previousNameIndex];
					
					socket.emit('nameResult', {
						success: true,
						name: name
					});
					socket.broadcast.to(currentRoom[socket.id]).emit('message', {
						text: previousName + ' is now known as ' + name + '.'
					});
				} else {
					socket.emit('nameResult', {
						success: false, message: 'That name is already in use.'
					});
				}
			}
		});
	}
							//SENDING CHAT MESSAGES
					function handleMessageBroadcasting(socket) {
					socket.on('message', function (message) {
					socket.broadcast.to(message.room).emit('message', {
					text: nickNames[socket.id] + ': ' + message.text
				});
         `			});
       }
				//creating room 
				function handleRoomJoining(socket) {
					socket.on('join',function(room) {
						socket.leave(currentRoom[socket.id]);
						joinRoom(socket, room.newRoom);
					});
				}
				//handle user disconnection
				function handleClientDisconnection(socket) {
					socket.on('disconnect', function() {
						var nameIndex = namesUsed.indexof(nickNames[socket.id]);
						delete names[nameindex];
						delete nickNames[socket.id];
					});
				}
						
