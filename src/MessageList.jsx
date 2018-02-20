import React, { Component } from 'react';
import Message from './Message.jsx';

class MessageList extends Component {

	MessagePresenter(messages, updateUser) {
		const messageList = messages.map((message => {
			return <Message
				key={message.id}
				username={message.username}
				content={message.content}
				userChange={message.userChange}
			/>
		}));
		return messageList;
	}

	render() {
		const updateUser = this.props.updateUser
		console.log("Rendering <MessageList />");
		return (
			<main className="messages">
				{this.MessagePresenter(this.props.messages)}
			</main>
		);
	}
}
export default MessageList;


