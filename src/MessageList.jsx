import React, { Component } from 'react';
import Message from './Message.jsx';

class MessageList extends Component {
	
	MessagePresenter(messages) {
		const messageList = messages.map((message => {
			return <Message
				key={message.id}
				username={message.username}
				content={message.content}
				userChange={message.userChange}
				color={message.color}
			/>
		}));
		return messageList;
	}

	render() {
		console.log("Rendering <MessageList />");
		return (
			<main className="messages">
				{this.MessagePresenter(this.props.messages)}
			</main>
		);
	}
}
export default MessageList;


