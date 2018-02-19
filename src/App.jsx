import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import ChatBar from './ChatBar.jsx';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: { name: "Bob" }, // optional. if currentUser is not defined, it means the user is Anonymous
      messages: []};
  }

  // componentDidMount() {
  //   console.log("componentDidMount <App />");
  //   setTimeout(() => {
  //     console.log("Simulating incoming message");
  //     // Add a new message to the list of messages in the data store

  //   }, 3000);
  // }

  newMessage = (content) => {
    //Random user ID generator
    function generateRandomID() {
      var randomID = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 8; i++) {
        randomID += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return randomID;
    }
    const newMessage = { id: generateRandomID(), username: this.state.currentUser.name, content: content };
    const messages = this.state.messages.concat(newMessage);
    // Update the state of the app component.
    // Calling setState will trigger a call to render() in App and all child components.
    this.setState({ messages: messages })
  }

  render() {
    console.log("Rendering <App/>");
    return (
      <div>
        <MessageList messages = {this.state.messages} />
        <ChatBar 
        currentUser = {this.state.currentUser}
        newMessage = {this.newMessage}  />
      </div>
    );
  }
}
export default App;
