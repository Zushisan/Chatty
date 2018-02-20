import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: { name: "" }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []
    };
  }

  componentDidMount() {
    console.log("componentDidMount <App />");
    const that = this;
    this.socket = new WebSocket("ws://localhost:3001/");
    // const that = this;
    // this.socket.onopen = function (event) {
    //   that.socket.send("Here's some text that the server is urgently awaiting!");
    // };
   
    this.socket.onmessage = function (event) {

      const data = JSON.parse(event.data);
      switch (data.type) {
        case "incomingMessage":
          // handle incoming message
          const newMessage = { id: data.id, username: data.username, content: data.content };
          const messages = that.state.messages.concat(newMessage);
          that.setState({ messages: messages });
          break;
        case "incomingNotification":
          // handle incoming notification
          const newUsernameMessage = { userChange: data.content };
          const notifications = that.state.messages.concat(newUsernameMessage);
          that.setState({ messages: notifications });
          break;
        default:
          // show an error in the console if the message type is unknown
          throw new Error("Unknown event type " + data.type);
      }
    }
  }

  newMessage = (content) => {
    if (!this.state.currentUser.name){
      this.state.currentUser.name = "Anonymous";
    }
    const newMessage = { type: "postMessage", username: this.state.currentUser.name, content: content };
    this.socket.send(JSON.stringify(newMessage));
  }

  newUser = (username) => {
    if (!this.state.currentUser.name) {
      this.state.currentUser.name = "Anonymous";
    }
    const newUser = { type: "postNotification", content: `${this.state.currentUser.name} changed their name to ${username}` }
    this.socket.send(JSON.stringify(newUser));
    this.setState({ currentUser: { name: username } });
  }

  render() {
    console.log("Rendering <App/>");
    return (
      <div>
        <MessageList 
          messages = {this.state.messages}
        />
        <ChatBar 
          newUser = {this.newUser}
          newMessage = {this.newMessage}  
        />
      </div>
    );
  }
}
export default App;
