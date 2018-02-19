import React, { Component } from 'react';

class Message extends Component {
	render() {
		console.log("Rendering <Message />");
		const username = this.props.username;
		const content = this.props.content;
		return (
			<div>
				<div className="message">
					<span className="message-username">{username}</span>
					<span className="message-content">{content}</span>
				</div>
				<div className="message system">
					
        </div>
			</div>
		);
	}
}
export default Message;