import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: { name: "" }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []};
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
      const receivedMessage = JSON.parse(event.data);
      const newMessage = { id: receivedMessage.id, username: receivedMessage.username, content: receivedMessage.content};
      const messages = that.state.messages.concat(newMessage);

      that.setState({ messages: messages })
    }
  }

  newMessage = (content) => {
    if (!this.state.currentUser.name){
      this.state.currentUser.name = "Anonymous";
    }
    const newMessage = { username: this.state.currentUser.name, content: content };
    this.socket.send(JSON.stringify(newMessage));
  }

  newUser = (username) => {
    this.setState({ currentUser: { name: username}});
  }

  render() {
    console.log("Rendering <App/>");
    return (
      <div>
        <MessageList messages = {this.state.messages} />
        <ChatBar 
        newUser = {this.newUser}
        newMessage = {this.newMessage}  />
      </div>
    );
  }
}
export default App;
