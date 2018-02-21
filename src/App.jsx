import React, { Component } from "react";
import NavBar from "./NavBar.jsx";
import MessageList from "./MessageList.jsx";
import ChatBar from "./ChatBar.jsx";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: { name: "", color: "", currentRoom: "mainRoom" }, // optional. if currentUser is not defined, it means the user is Anonymous
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
    // const that = this;

    // this.socket.onopen = function (event) {
    //   that.socket.send("Here's some text that the server is urgently awaiting!");
    // };

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
            color: newColor
          };
          const messages = that.state.messages.concat(newMessage);
          that.setState({ messages: messages });
          break;
        case "incomingNotification":
          // handle incoming notification
          const newUsernameMessage = {
            content: data.content,
            type: "incomingNotification"
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
            currentUser: { name: that.state.currentUser.name, color: color }
          });
          break;
        case "initMessages":
          // Initial messages
          const welcomeMessage = {
            type: "incomingNotification",
            content: "------ MAIN CHAT ROOM ------"
          };
          const initMessages = data.messages.concat(welcomeMessage);
          that.setState({ messages: initMessages });
          break;
        case "incomingRoomChange":
          // Setting the name format displayed, not really elegant
          let newRoom = "";
          switch(data.room){
            case "mainRoom":
              newRoom = { content: `------ MAIN CHAT ROOM ------`, type: "incomingNotification" };
              break;
            case "botRoom":
              newRoom = { content: `------ NOT SO CLEVER BOT ROOM ------`, type: "incomingNotification" };
              break;
            case "lightRoom":
              newRoom = { content: `------ LIGHTHOUSE LAB ROOM ------`, type: "incomingNotification" };
              break;
          }
          const newRoomNotification = that.state.messages.concat(newRoom);
          that.setState({ messages: newRoomNotification });
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
      color: this.state.currentUser.color
    };
    this.socket.send(JSON.stringify(newMessage));
  };

  newUser = username => {
    if (!this.state.currentUser.name) {
      this.state.currentUser.name = "Anonymous";
    }
    const newUser = {
      type: "postNotification",
      content: `${
        this.state.currentUser.name
      } changed their name to ${username}`
    };
    this.socket.send(JSON.stringify(newUser));
    this.setState({
      currentUser: { name: username, color: this.state.currentUser.color }
    });
  };

  changeRoom = room => {
    const currentRoom = room;
    console.log(room)
    let setRoom = this.state[room];
    setRoom.push(this.state.currentUser.name); // Will be changed to IDs

    let newState = {
      currentUser: {
        name: this.state.currentUser.name,
        color: this.state.currentUser.color,
        currentRoom: room
      }
    };

    newState[room] = setRoom;
    const toServer = { type:"postRoomChange", room}; // Info for our server

    this.socket.send(JSON.stringify(toServer));
    this.setState(newState);
  };  

  scrollToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  render() {
    return (
      <div>
        <NavBar changeRoom={this.changeRoom} connectedUsers={this.state.connectedUsers} />
        <div>
          <MessageList messages={this.state.messages} />
          <ChatBar newUser={this.newUser} newMessage={this.newMessage} />
        </div>
      </div>
    );
  }
}
export default App;
