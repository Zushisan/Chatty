import React, { Component } from 'react';

class Message extends Component {
	render() {
		console.log("Rendering <Message />");
		const username = this.props.username;
		const content = this.props.content;
		const userChange = this.props.userChange;
		const color = this.props.color;
		console.log(color)
		return (
			<div>
				<div className="message">
					<span className="message-username" style={{color: color}}>{username}</span>
					<span className="message-content">{content}</span>
				</div>
				{userChange &&
					(<div className="message system">
						{userChange}
					</div>)
				}
			</div>
		);
	}
}
export default Message;