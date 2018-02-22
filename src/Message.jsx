import React, { Component } from "react";

class Message extends Component {
  render() {

    const username = this.props.username;
    const content = this.props.content;   
    const color = this.props.color;

    const reg = new RegExp('^https://.*(\.gif|\.jpg|\.png)')
    let isImg = reg.test(content);

    return <div>
        <div className="message">
          <div>
            {this.props.type === "incomingMessage" && <div>
                <span className="message-username" style={{ color: color }}>
                  {username}
                </span>
                <span className="message-content">
                  {isImg ? <img src={content} /> : <span>{content}</span>}
                </span>
              </div>}
          </div>
          <div>
            {this.props.type === "incomingNotification" && <div className="message system" style={{ color: "orange" }}>
                {content}
              </div>}
          </div>
        </div>
      </div>;
  }
}
export default Message;

