import React, { Component } from "react";
import Message from "./Message.jsx";

class MessageList extends Component {
  
  MessagePresenter(messages) {
    const messageList = messages.map(message => {
      return (
        <Message
          key={message.id}
          username={message.username}
          content={message.content}
          type={message.type}
          color={message.color}
        />
      );
    });
    return messageList;
  }

  render() {
    return (
      <main className="messages">
        {this.MessagePresenter(this.props.messages)}
      </main>
    );
  }
}
export default MessageList;
