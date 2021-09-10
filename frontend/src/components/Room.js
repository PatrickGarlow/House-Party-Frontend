import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      showSettings: false,
      showQRCode: false,
      spotifyAuthenticated: false,
      song: {},
      qrCodeLink: '',

    };
    this.roomCode = this.props.match.params.roomCode;
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.authenticateSpotify = this.authenticateSpotify.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);
    this.copyButtonPressed = this.copyButtonPressed.bind(this);
    this.getRoomDetails();
  }

  componentDidMount() {
    this.interval = setInterval(this.getCurrentSong, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getRoomDetails() {
    return fetch("/api/get-room" + "?code=" + this.roomCode)
      .then((response) => {
        if (!response.ok) {
          this.props.leaveRoomCallback();
          this.props.history.push("/");
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
          qrCodeLink: data.qr_code_link,
        });
        if (this.state.isHost) {
          this.authenticateSpotify();
        }
      });
  }

  authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ spotifyAuthenticated: data.status });
        console.log(data.status);
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      });
  }

  getCurrentSong() {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.setState({ song: data });
      });
  }

  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((_response) => {
      this.props.leaveRoomCallback();
      this.props.history.push("/");
    });
  }

  updateShowSettings(value) {
    this.setState({
      showSettings: value,
    });
  }

  renderSettings() {
    return (
      <div>
        <div>
          <CreateRoomPage
            update={true}
            votesToSkip={this.state.votesToSkip}
            guestCanPause={this.state.guestCanPause}
            roomCode={this.roomCode}
            updateCallback={this.getRoomDetails}
          />
        </div>
        <div class="btn-group">
          <button class="red" onClick={() => this.updateShowSettings(false)}>
            Close
          </button>
        </div>
      </div>
    );
  }

  updateShowQRCode(value) {
    this.setState({
      showQRCode: value,
    });
  }

  renderButtons () {
    if(!this.state.showQRCode && !this.state.showSettings) {

      //show both together
      return (
      <div>
        <div class="btn-group">
          <button class="red" onClick={() => this.updateShowSettings(true)}>
            Settings
          </button>
          <button class="blue" onClick={() => this.updateShowQRCode(true)}>
            Show QR Code
          </button>
        </div>
        <div class="btn-group">
          <button class="teal" onClick={this.leaveButtonPressed}>
            Leave Room
          </button>
        </div>
      </div>
      );
    }
    else if(!this.state.showSettings && this.state.showQRCode) {
      //only show qr
      return (
        <div>
          <div class="btn-group">
            <button class="red" onClick={() => this.updateShowSettings(true)}>
              Settings
            </button>
          </div>
          <div class="qr-code-item">
            <img src={this.state.qrCodeLink} class="qr-code"></img>
            <div class="btn-group">
              <button class="blue" onClick={() => this.updateShowQRCode(false)}>Hide QR Code</button>
            </div>
          </div>
          <div class="btn-group">
            <button class="teal" onClick={this.leaveButtonPressed}>
              Leave Room
            </button>
          </div>
        </div>
        );
    }
    else {
      //this shouldn't be possible :/
    }

  }

  copyButtonPressed() {
    var copyText = document.getElementsByClassName("page-subtitle")[0].innerHTML;
    copyText = copyText.replace("Code: ","");
    var el = document.createElement('textarea');
    el.value = copyText;
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el)

  }


  render() {
    if (this.state.showSettings) {
      return this.renderSettings();
    }
    return (
      <div>
        <div class="room-code">
          <h4 class="page-subtitle">
            Code: {this.roomCode}
          </h4>
          <button id="button-nostyle" onClick={this.copyButtonPressed}><img src="../../static/frontend/copy.svg"></img></button>
          
        </div>
        
        <MusicPlayer {...this.state.song} />
        {this.renderButtons()}
      </div>
    );
  }
}