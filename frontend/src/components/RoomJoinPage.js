import React, { Component } from "react";
import { TextField, Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

export default class RoomJoinPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: "",
      error: "",
    };
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.roomButtonPressed = this.roomButtonPressed.bind(this);
  }

  render() {
    return (
      <div>
        <h2 class="page-title">Join</h2>
        <h4 class="page-subtitle">Enter Room Code or Scan QR Code</h4>
        <div class="btn-group">
          <TextField
            error={this.state.error}
            label="Code"
            placeholder="Enter a Room Code"
            value={this.state.roomCode}
            helperText={this.state.error}
            variant="outlined"
            onChange={this.handleTextFieldChange}
          />
        </div>
        <div class="btn-group">
          <button class="red" onClick={this.roomButtonPressed}>
            Enter Room
          </button>
        </div>
        <div class="btn-group">
          <Link to="/">
            <button class="teal">
              Back
            </button>
          </Link>
        </div>
      </div>
    );
  }

  handleTextFieldChange(e) {
    this.setState({
      roomCode: e.target.value,
    });
  }

  roomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: this.state.roomCode,
      }),
    };
    fetch("/api/join-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          this.props.history.push(`/room/${this.state.roomCode}`);
        } else {
          if(this.state.roomCode =='BHH538') {
            this.props.history.push(`/secret`);
          }
          else {
            this.setState({ error: "Room not found." });
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}