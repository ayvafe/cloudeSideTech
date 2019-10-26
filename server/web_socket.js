const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 5001})

const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
const server = http.createServer();


server.listen(webSocketsServerPort);
const wss = new webSocketServer({
  httpServer: server
});

wss.on("connection", function(ws) {
	ws.on("message", function(message) {
		console.log("Message resieved" + wss.clients);
		if(wss.clients) {
			console.log("Client exists");
			wss.clients.forEach(function e(client) {
				if(client != ws) {
					console.log("WS is not client");
					client.send(message);
				}

			})
		}
	});
	ws.on("close", function() {
		console.log("Lost Client");
	});
});
