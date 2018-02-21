import React, { Component } from "react";

class Message extends Component {
  render() {
    console.log("Rendering <Message />");
    const username = this.props.username;
    const content = this.props.content;
    const userChange = this.props.userChange;
    const color = this.props.color;

    // Checking for img
    // let isImg = %r{^http://.*\.(jpeg|jpg|gif|png)$}i.test("content");
    // /^https ?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|gif|png)$/i
    // 	(?i) \.(jpg | png | gif)$
    let isImg = /\.(gif|jpg|jpeg|png)$/i.test(content);

    return (
      <div>
        <div className="message">
          <span className="message-username" style={{ color: color }}>
            {username}
          </span>
          <span className="message-content">
            {isImg ? <img src={content} /> : <span>{content}</span>}
          </span>
        </div>
        {userChange && <div className="message system">{userChange}</div>}
      </div>
    );
  }
}
export default Message;

// {
// 	(this.state.connectedUsers === "1") ?
// 	<span> You are alone right now. </span> :
// 	<span>Connected users: {this.state.connectedUsers} </span>
// }
