import React, { Component } from "react";
import NavBar from "./NavBar.jsx";
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: {id:"", name: "Anonymous", color: "", currentRoom: "mainRoom" }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: [],
      connectedUsers: "",
      mainRoom: [],
      botRoom: [],
      lightRoom: []
    };
  }

  componentDidMount() {
    const that = this;
    this.scrollToBottom();
    this.socket = new WebSocket("ws://localhost:3001/");

    this.socket.onmessage = function(event) {
      that.scrollToBottom();
      const data = JSON.parse(event.data);
      switch (data.type) {
        case "incomingMessage":
          // handle incoming message
          const newColor = data.color.toString();
          const newMessage = {
            id: data.id,
            type: "incomingMessage",
            username: data.username,
            content: data.content,
            color: newColor,
            room: data.room
          };
          const messages = that.state.messages.concat(newMessage);
          that.setState({ messages: messages });
          break;
        case "incomingNotification":
          // handle incoming notification
          const newUsernameMessage = {
            content: data.content,
            type: "incomingNotification",
            room: data.room
          };
          const notifications = that.state.messages.concat(newUsernameMessage);
          that.setState({ messages: notifications });
          break;
        case "incomingNumberOfConnexions":
          // handle the number of connected users
          const numberOfConnexions = data.count;
          that.setState({ connectedUsers: numberOfConnexions });
          break;
        case "incomingColor":
          const color = data.color.toString();
          that.setState({
            currentUser: { name: that.state.currentUser.name, color: color, currentRoom: that.state.currentUser.currentRoom }
          });
          break;
        case "initMessages":
          // Initial messages
          const welcomeMessage = {
            type: "incomingNotification",
            content: "WELCOME TO CHATTY"
          };
          const initMessages = data.messages.concat(welcomeMessage);
          that.setState({
            messages: initMessages,
            mainRoom: data.rooms.mainRoom,
            botRoom: data.rooms.botRoom,
            lightRoom: data.rooms.lightRoom
          });
          break;
        case "incomingRoomChange":
          // Setting the name format displayed, not really elegant
          let newRoom = "";
          switch(data.room){
            case "mainRoom":
              newRoom = { content: data.content, type: "incomingNotification", room: data.room };
              break;
            case "botRoom":
              newRoom = { content: data.content, type: "incomingNotification", room: data.room };
              break;
            case "lightRoom":
              newRoom = { content: data.content, type: "incomingNotification", room: data.room };
              break;
            default:
              throw new Error("Uknown room " + data.room);
          }
          // const newRoomNotification = data.messages.concat(newRoom);
          const newRoomNotification = that.state.messages.concat(newRoom);
          that.setState({ messages: newRoomNotification });
          break;
        case "incomingRoomExit":
          // Setting the name format displayed, not really elegant
          let exitRoom = "";
          switch (data.oldRoom) {
            case "mainRoom":
              exitRoom = { content: data.content, type: "incomingNotification", room: data.oldRoom };
              break;
            case "botRoom":
              exitRoom = { content: data.content, type: "incomingNotification", room: data.oldRoom };
              break;
            case "lightRoom":
              exitRoom = { content: data.content, type: "incomingNotification", room: data.oldRoom };
              break;
            default:
              throw new Error("Uknown room " + data.room);
          }
          const exitRoomNotification = that.state.messages.concat(exitRoom);
          that.setState({ messages: exitRoomNotification });
          break;
        case "incomingId":
          that.setState({
            currentUser: {
              id: data.id,
              name: that.state.currentUser.name,
              color: that.state.currentUser.color,
              currentRoom: that.state.currentUser.currentRoom
            }})
          break;
        case "incomingRoomSetters":
            that.setState({ mainRoom: data.rooms.mainRoom, botRoom: data.rooms.botRoom, lightRoom: data.rooms.lightRoom })
          break;
        default:
          // show an error in the console if the message type is unknown
          throw new Error("Unknown event type " + data.type);
      }
      that.scrollToBottom();
    };
  }

  newMessage = content => {
    if (!this.state.currentUser.name) {
      this.state.currentUser.name = "Anonymous";
    }
    const newMessage = {
      type: "postMessage",
      username: this.state.currentUser.name,
      content: content,
      color: this.state.currentUser.color,
      room: this.state.currentUser.currentRoom
    };
    this.socket.send(JSON.stringify(newMessage));
  };

  newUser = username => {
    if (!this.state.currentUser.name) {
      this.state.currentUser.name = "Anonymous";
    }
    const newUser = {
      type: "postNotification",
      content: `${this.state.currentUser.name} changed their name to ${username}`,
      room: this.state.currentUser.currentRoom
    };
    this.socket.send(JSON.stringify(newUser));
    this.setState({
      currentUser: { name: username, color: this.state.currentUser.color, currentRoom: this.state.currentUser.currentRoom, id: this.state.currentUser.id }
    });
  };

  // Handle the general changing of rooms
  changeRoom = room => {

    let newState = {
      currentUser: {
        id: this.state.currentUser.id,
        name: this.state.currentUser.name,
        color: this.state.currentUser.color,
        currentRoom: room
      }
    };

    const toServerNew = { type:"postRoomChange", room: room, oldRoom:this.state.currentUser.currentRoom, user: this.state.currentUser.name, id: this.state.currentUser.id };
    const toServerOld = { type: "postRoomExit", oldRoom: this.state.currentUser.currentRoom, user: this.state.currentUser.name, id: this.state.currentUser.id };
     // Info for our server

    this.socket.send(JSON.stringify(toServerNew));
    this.socket.send(JSON.stringify(toServerOld));
    this.setState(newState);
  };
  

  scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  render() {
    return (
      <div>
        <NavBar 
          changeRoom={this.changeRoom} 
          connectedUsers={this.state.connectedUsers} 
          currentRoom={this.state.currentUser.currentRoom}
          roomUsers={[this.state.mainRoom, this.state.botRoom, this.state.lightRoom]} 
        />
        <div>
          <MessageList 
            messages={this.state.messages} 
            currentRoom={this.state.currentUser.currentRoom} 
          />
          <ChatBar 
            newUser={this.newUser} 
            newMessage={this.newMessage} 
          />
        </div>
      </div>
    );
  }
}
export default App;
