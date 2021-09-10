import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { createTheme } from '@material-ui/core/styles';

export default class CreateRoomPage extends Component {
  static defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    qrCodeLink: null,
    updateCallback: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      guestCanPause: this.props.guestCanPause,
      votesToSkip: this.props.votesToSkip,
      errorMsg: "",
      successMsg: "",
    };

    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);

    
  }

  

  

  handleVotesChange(e) {
    this.setState({
      votesToSkip: e.target.value,
    });
  }

  handleGuestCanPauseChange(e) {
    this.setState({
      guestCanPause: e.target.value === "true" ? true : false,
    });
  }


  handleRoomButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => this.props.history.push("/room/" + data.code));
  }

  handleUpdateButtonPressed() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
        code: this.props.roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        this.setState({
          successMsg: "Room updated successfully!",
        });
      } else {
        this.setState({
          errorMsg: "Error updating room...",
        });
      }
      this.props.updateCallback();
    });
  }

  renderCreateButtons() {
    return (
      <div>
        <div class="btn-group">
          <button class="red" onClick={this.handleRoomButtonPressed}>
          Create A Room
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

  renderUpdateButtons() {
    return (
      <div>
        <div class="btn-group">
          <button class="red" onClick={this.handleUpdateButtonPressed}>
          Update Room
          </button>
        </div>
      </div>
    );
  }

  render() {
    const title = this.props.update ? "Update Room" : "Create a Room";
    

    return (
      <div>
        <div class="btn-group">
          <Collapse
          in={this.state.errorMsg != "" || this.state.successMsg != ""}
          >
          {this.state.successMsg != "" ? (
            <Alert
            severity="success"
            onClose={() => {
              this.setState({ successMsg: "" });
            }}
            >
            {this.state.successMsg}
            </Alert>
          ) : (
            <Alert
            severity="error"
            onClose={() => {
              this.setState({ errorMsg: "" });
            }}
            >
            {this.state.errorMsg}
            </Alert>
          )}
          </Collapse>
        </div>
        <h2 class="page-title">{ title }</h2>
        <h4 class="page-subtitle">Enter room settings</h4>
        <div class="btn-group">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest Control of Playback State</div>
            </FormHelperText>
            <RadioGroup
            row
            defaultValue={this.props.guestCanPause.toString()}
            onChange={this.handleGuestCanPauseChange}
            >
              <FormControlLabel
              value="true"
              control={<Radio color="primary"/>}
              label="Play/Pause"
              labelPlacement="bottom"
              />
              <FormControlLabel
              value="false"
              control={<Radio color="primary"/>}
              label="No Control"
              labelPlacement="bottom"
              />
            </RadioGroup>
          </FormControl>
        </div>
        <div class="btn-group">
          <FormControl>
            <TextField
              required={true}
              type="number"
              onChange={this.handleVotesChange}
              defaultValue={this.state.votesToSkip}
              inputProps={{
              min: 1,
              style: { textAlign: "center" },
              }}
            />
            <FormHelperText>
              <div align="center">Votes Required To Skip Song</div>
            </FormHelperText>
          </FormControl>
        </div>
        {this.props.update
          ? this.renderUpdateButtons()
          : this.renderCreateButtons()}
      </div>
    );
  }
}