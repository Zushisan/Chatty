import React, { Component } from "react";

class NavBar extends Component {
  render() {
    const users = this.props.connectedUsers;
    return <nav className="navbar">
        <a href="/" className="navbar-brand">
          Chatty
        </a>
        
          <span>
            <button name="mainRoom" onClick={event => {
                this.props.changeRoom(event.target.name);
              }}> Main Chat </button>
            <button name="botRoom" onClick={event => {
                this.props.changeRoom(event.target.name);
              }}> Bot Chat </button>
              <button name="lightRoom" onClick={event => {
                this.props.changeRoom(event.target.name);
              }}> Light Chat </button>
          </span>
        

        <span className="navbar-users">
          {users === "1" ? (
            <span> You are alone right now. </span>
          ) : (
            <span> Connected users: {users} </span>
          )}
        </span>
      </nav>;
  }
}
export default NavBar;
