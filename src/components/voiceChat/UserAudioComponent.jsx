import React from 'react';
import styled from 'styled-components';
import {ListItem, ListItemText, IconButton, Avatar} from '@mui/material';
import MicOutlinedIcon from "@mui/icons-material/MicOutlined";
import MicOffIcon from "@mui/icons-material/MicOff";
import OpenViduAudioComponent from './OvAudio';
import {Mic, MicOff} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

const AudioContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const UserAudioComponent = ({ streamManager, isLocalUser, handleToggle, isMike }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  const {email, nickname} = userInfo
  const getNicknameTag = () => {
    try {
      const connectionData = streamManager.stream.connection.data;
      if (connectionData) {
        const clientData = JSON.parse(connectionData);
        return clientData.clientData;
      }
      return 'Unknown';
    } catch (error) {
      console.error('Error parsing connection data:', error);
      return 'Unknown';
    }
  };

  const isMicActive = () => {
    return streamManager.stream.audioActive;
  };

  return (
      <ListItem sx={{height: "20px", mt: "10px"}}>
        <Avatar
            sx={{ width: 20, height: 20, marginRight: 1 }}
        />
        <AudioContainer>
          <OpenViduAudioComponent streamManager={streamManager} />
          <ListItemText primary={getNicknameTag()} primaryTypographyProps={{ fontSize: '14px' }} />
          {isLocalUser ? null : (
              <IconButton size="small" disabled>
                {isMicActive() ? null : <MicOff />}
              </IconButton>
          )}
        </AudioContainer>
      </ListItem>
  );
};

export default UserAudioComponent;