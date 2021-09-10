import React, {useState, useEffect} from "react";
import {Grid, Button, Typography, IconButton} from  "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import {Link} from "react-router-dom";

const pages = {
    JOIN_CODE: 'pages.join_code',
    JOIN_QR: 'pages.join_qr',
    CREATE_ROOM_SETTINGS: 'pages.create_room_settings',
    CREATE_ROOM_CONNECT: 'pages.create_room_connect',
    UPDATE_SETTINGS: 'pages.update_settings',
    SITE_INFO: 'pages.site_info',

}

export default function Info(props) {

    const [page, setPage] = useState(pages.SITE_INFO);

    function siteInfo() {
      const content = (
        <div class="info-tab-content">
          <h2 class="dark-text info-tab-content-text">
            House Party is a group music controller using Spotify. Users can create and join a room with others. 
            While in this room users can control the music of the host account. 
            <br/>
            <br/>
            An example of this being used is
            at a party with one account playing music. Guests at the party can join the room and change the music. 
          </h2>
        </div>
      )
      return tabBuilder("What is House Party?",false, null, 1, true, pages.CREATE_ROOM_SETTINGS, content);
    }
    function createRoomSettingsInfo() {
      const content = (
        <div class="info-tab-content">
          <h2 class="dark-text info-tab-content-text">
            When setting up a room for users to join, a host can choose some settings for the room. 
          </h2>
          <br/>
          <h1 class="dark-text info-tab-content-text">User Playback</h1>
          <h2 class="dark-text info-tab-content-text">
            User playback refers to the guests abilities to play and pause the song playing. If this setting is not active
            the host can still play/pause. 
          </h2>
          <img src="../../static/frontend/playback.svg" class="info-tab-content-img"></img>
          <h1 class="dark-text info-tab-content-text">Votes needed to skip song</h1>
          <h2 class="dark-text info-tab-content-text">
            This setting changes the number of votes needed to skip a song. Users can vote to skip the current song, but it will not be skipped
            until the number required is reached. Regardless of what this is set to, the host can skip the song.
          </h2>
          <img src="../../static/frontend/votesNeeded.svg" class="info-tab-content-img"></img>
        </div>
      )
      return tabBuilder("Settings for creating a room",true, pages.SITE_INFO, 2, true, pages.CREATE_ROOM_CONNECT, content);
    }
    function createRoomConnectInfo() {
      const content = (
        <div class="info-tab-content">
          <h2 class="dark-text info-tab-content-text">
            Connecting to Spotify is as easy as logging in! Hosts must have Spotify Premium! 
          </h2>
          <img src="../../static/frontend/SpotifySignin.PNG" class="info-tab-content-img"></img>
        </div>
      )
      return tabBuilder("Connecting to Spotify",true, pages.CREATE_ROOM_SETTINGS, 3, true, pages.JOIN_CODE, content);
    }
    function joinCodeInfo() {
      const content =  (
      <div class="info-tab-content">
        <h2 class="dark-text info-tab-content-text">
          One way to join a room is through the room code. This is generated when a room is created. Anyone can share
          this code. 
        </h2>
        <img src="../../static/frontend/CodeJoin1.PNG" class="info-tab-content-img"></img>
        <h2 class="dark-text info-tab-content-text">
          Simply enter this code into the text box and click the join button.
        </h2>
        <img src="../../static/frontend/CodeJoin2.PNG" class="info-tab-content-img"></img>
      </div>
      );
      return tabBuilder("Join page with Room Code",true, pages.CREATE_ROOM_CONNECT, 4, true, pages.JOIN_QR, content);
    }
    function joinQRInfo () {
      const content =  (
        <div class="info-tab-content">
          <h2 class="dark-text info-tab-content-text">
            Another way to join a room is through the QR code. This is generated when a room is created. Anyone can share
            this code. 
            <br/>
            <br/>
            Just scan the code with your phone and you will join the room.
          </h2>
          <img src="../../static/frontend/QRJoin.PNG" class="info-tab-content-img"></img>
        </div>
        );
      return tabBuilder("Join page with QR Code",true, pages.JOIN_CODE, 5, true, pages.UPDATE_SETTINGS, content);
    }
    function settingsInfo() {
      const content =  (
        <div class="info-tab-content">
          <h2 class="dark-text info-tab-content-text">
            At any time the host of the room can update the room settings. Just press the button and change any settings. Then save and
            the changes will immediately go into effect. 
          </h2>
          <img src="../../static/frontend/UpdateRoom.PNG" class="info-tab-content-img"></img>
        </div>
        );
      return tabBuilder("Update Room Settings",true, pages.JOIN_QR, 6, false, null, content);
    }

    function tabBuilder(title, buttonBefore, linkBefore, pageNumber, buttonAfter, linkAfter, middleContent) {
      return (
        <div class="info-window">
          <div class="info-tab">
            <h3 class="dark-text page-subtitle">{title}</h3>
            {middleContent}
            <div class="info-nav-buttons">
              {buttonBefore ? (
                <IconButton onClick={() => {setPage(linkBefore)}}>
                  <NavigateBeforeIcon />
                </IconButton>
              ): (
                <h4 class="nav-space">&nbsp;</h4>
              )}
              
              <h4 class="dark-text">{pageNumber}</h4>
              
              {buttonAfter ? (
                <IconButton onClick={() => {setPage(linkAfter)}}>
                  <NavigateNextIcon />
                </IconButton>
              ): (
                <h4 class="nav-space">&nbsp;</h4>
              )}
            </div>
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

    function renderTab() {
      
      switch(page){
        case pages.JOIN_CODE:
          return joinCodeInfo();
        case pages.JOIN_QR:
          return joinQRInfo();
        case pages.CREATE_ROOM_SETTINGS:
          return createRoomSettingsInfo();
        case pages.CREATE_ROOM_CONNECT:
          return createRoomConnectInfo();
        case pages.SITE_INFO:
          return siteInfo();
        case pages.UPDATE_SETTINGS:
          return settingsInfo();
        default:
          return siteInfo();
      }
    }


    
    return renderTab();
}