import React, { Component } from "react";

class NavBar extends Component {
  render() {
    const users = this.props.connectedUsers;
    let currentRoom = this.props.currentRoom;

    // if(currentRoom === undefined){
    //   currentRoom = "mainRoom";
    // }
    return <nav className="navbar">
        <a href="/" className="navbar-brand">
          Chatty
        </a>
        
          <span>
            {(currentRoom === "mainRoom" ?
              <button name="mainRoom" className="active-button"> Main Chat </button> :
              <button name="mainRoom" className="inactive-button" onClick={event => {
                  this.props.changeRoom(event.target.name);
            }}> Main Chat </button>)}

            {(currentRoom === "botRoom" ?
              <button name="botRoom" className="active-button"> Bot Chat </button> :
              <button name="botRoom" className="inactive-button" onClick={event => {
                  this.props.changeRoom(event.target.name);
            }}> Bot Chat </button>)}

              {(currentRoom === "lightRoom" ?
              <button name="lightRoom" className="active-button"> Light Chat </button> :
              <button name="lightRoom" className="inactive-button" onClick={event => {
                  this.props.changeRoom(event.target.name);
            }}> Light Chat </button>)}
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








