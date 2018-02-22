import React, { Component } from "react";

class Message extends Component {
  render() {

    const username = this.props.username;
    const content = this.props.content;   
    const color = this.props.color;

    // Checking for img
    // let isImg = %r{^http://.*\.(jpeg|jpg|gif|png)$}i.test("content");
    // /^https ?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|gif|png)$/i
    // 	(?i) \.(jpg | png | gif)$
    const reg = new RegExp('^https ?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|gif|png)$/i')
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

