import React, { Component } from 'react';

class ChatBar extends Component {

	render() {
		const currentUser = this.props.currentUser.name;
		console.log("Rendering <ChatBar />");
		return (
			<footer className="chatbar">
				<input className="chatbar-username" placeholder="Your Name (Optional)" value={currentUser}/>
				<input className="chatbar-message" placeholder="Type a message and hit ENTER"
				onKeyPress = {event => {
					if(event.key === "Enter"){
						this.props.newMessage(event.target.value);
						event.target.value = "";
					}
				}} />
			</footer>
		);
	}
}
export default ChatBar;