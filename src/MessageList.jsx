import React, { Component } from "react";
import Message from "./Message.jsx";

class MessageList extends Component {
  
  MessagePresenter(messages, currentRoom) {

    const messageList = messages.map(message => {
      if(message.room === currentRoom){
        return (
          <Message
            key={message.id}
            username={message.username}
            content={message.content}
            type={message.type}
            color={message.color}
          />
        );
      }
    });
    return messageList;
  }

  render() {
    return (
      <main className="messages">
        {this.MessagePresenter(this.props.messages, this.props.currentRoom)}
      </main>
    );
  }
}
export default MessageList;
