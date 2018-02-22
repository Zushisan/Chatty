// server.js

const express = require("express");
const SocketServer = require("ws").Server; // remove server
const CheckSocket = require("ws"); // remove server
const uuidv4 = require("uuid/v4");
const Cleverbot = require("cleverbot-node");

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static("public"))
  .listen(PORT, "0.0.0.0", "localhost", () =>
    console.log(`Listening on ${PORT}`)
  );

// Create the WebSockets server
const wss = new SocketServer({ server }); // set it like the example

cleverbot = new Cleverbot();
cleverbot.configure({ botapi: "CC7c4DeP803JvvtSRqfONDPOPSw" }); // I DONT CARE
let botData = "";

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.

let messages = [];
let messagesInit = { type: "initMessages", messages: messages }; // Storing messages on server to render them to all users on connexion

wss.on("connection", ws => {
  console.log("Client connected");

  const colors = [
    "#3AD629",
    "#2990D6",
    "#C529D6",
    "#D66F29",
    "#20133b",
    "#8e7fac",
    "#008744",
    "#0057e7",
    "#d62d20",
    "#ffa700"
  ];
  let color = colors[Math.floor(Math.random() * colors.length)];
  // ws.color = color; // Custom attribute with the color associated with that user
  let userColor = { type: "incomingColor", color };
  let userId = { type: "incomingId", id: uuidv4() };

  ws.send(JSON.stringify(userColor));
  ws.send(JSON.stringify(messagesInit));
  ws.send(JSON.stringify(userId));

  // Broadcast to all.
  ws.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === CheckSocket.OPEN) {
        client.send(data);
      }
    });
  };

  ws.allbutme = function allbutme(data) {
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === CheckSocket.OPEN) {
        client.send(data);
      }
    });
  };

  ws.on("message", function incoming(data) {
    data = JSON.parse(data);
    switch (data.type) {
      case "postMessage":
        data.id = uuidv4();
        data.type = "incomingMessage";
        messages.push(data);
        messagesInit = { type: "initMessages", messages: messages };

        cleverMessage = JSON.stringify(data.content);
        cleverbot.write(cleverMessage, function(response) {
          let botResponse = {
            type: "incomingMessage",
            username: "bot",
            content: response.clever_output,
            id: uuidv4(),
            color: "#20133b",
            room: "botRoom"
          };
          messages.push(botResponse);
          botResponse = JSON.stringify(botResponse);
          ws.broadcast(botResponse);
        });

        break;
      case "postNotification":
        data.type = "incomingNotification";
        messages.push(data);
        messagesInit = { type: "initMessages", messages: messages };
        break;
      case "postRoomChange":
        data.type = "incomingRoomChange"; // We want to notify where the user went
        data.content = `${data.user} joined the channel`;
        data = JSON.stringify(data);
        ws.allbutme(data);
        return;
      case "postRoomExit":
        data.type = "incomingRoomExit";
        data.content = `${data.user} left the channel`;
        data = JSON.stringify(data);
        ws.allbutme(data);
        return;
      default:
        data = JSON.stringify(data);
        ws.broadcast(data);
    }
    data = JSON.stringify(data);
    ws.broadcast(data);
  });

  let numberOfConnexions = {
    type: "incomingNumberOfConnexions",
    count: wss.clients.size
  };
  ws.broadcast(JSON.stringify(numberOfConnexions));
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on("close", () => {
    console.log("Client disconnected");
    numberOfConnexions.count = wss.clients.size;
    ws.broadcast(JSON.stringify(numberOfConnexions));
  });
});
