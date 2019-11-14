const http = require('http');
const mysql = require('mysql');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const serverPort = 8080;
const WebSocket = require('websocket').server;
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

const clients = {};

const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	return s4() + s4() + '-' + s4();
};

const server = http.createServer ( 
	function(request, response) {
		console.log((new Date()) + ' Received request for ' + request.url);
		const q = request.url.parse(request.url, true).query;
		if(request.url.pathname == '/login' && request.type == "POST") {
			loginHandler(request, response);
			return;
		}
		if(request.type == "GET") {
			if(req.pathname == '/login') {
			}
		} 
		response.writeHead(404);
		response.end();

	}
).listen(serverPort);


function loginHandler(req, res) {
	const filePath = path.join(__dirname, 'users.json');
	const stat = fileSystem.statSync(filePath);
	const readStream = fileSystem.createReadStream(filePath);
	readStream.pipe(response);
	return ;

}

const wss = new WebSocket({  httpServer: server });

wss.on('request', function(request) {
	console.log("Request resieved.");
	var userID = getUniqueID();
	const connection = request.accept(null, request.origin);
	clients[userID] = connection;
	console.log("Request resieved. Client ID : " + userID);
	connection.on("message", function(message) {
		console.log("Message resieved " + message);
		for (var k in clients) {
			if (k != userID ) {
        console.log("Client is not the same resieved : " + JSON.stringify(message));
				clients[k].send(JSON.stringify(message));
			}
		}
		console.log("Message resieved end ");
	});
	connection.on("close", function() {
		console.log((new Date()) + " Peer " + userID + " disconnected.");
		delete clients[userID];
	});
	connection.on("close", function() {
		console.log("Lost Client");
	});
});



