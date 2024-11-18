import React, { useState, useEffect, useCallback } from 'react';
import { OpenVidu } from 'openvidu-browser';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Tag as TagIcon,
} from '@mui/icons-material';
import UserAudioComponent from './UserAudioComponent';
import {
  createConnection,
  createRoom, deleteRoom,
  fetchRooms,
  initializeSession,
  updateRoom
} from "../../api/voiceChat/voiceChannelApi.js";
import * as colors from "@mui/material/colors";
import BottomBar from "./BottomBarComponent";

const VoiceChatComponent = ({ serverId }) => {
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [channelId, setChannelId] = useState(0);
  const [isMike, setIsMike] = useState(true);
  const [isSpeaker, setIsSpeaker] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  const {email, nickname} = userInfo

  const onFetchRooms = useCallback(async () => {
    if (!serverId) {
      console.error('ServerId is undefined');
      return;
    }
    try {
      const response = await fetchRooms(serverId);
      console.log('getRooms:', response.data);
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }, [serverId]);

  const onCreateRoom = async () => {
    try {
      const newRoomNameForm = {
        name : newRoomName,
        serverId: serverId
      }
      const response = await createRoom(newRoomNameForm);
      console.log('createRoom:', response.data);
      setRooms([...rooms, response.data]);
      setOpenCreateDialog(false);
      setNewRoomName('');
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const onEditRoom = async () => {
    try {
      const response = await updateRoom(channelId, newRoomName);
      console.log('updateRoom:', response.data);
      setOpenEditDialog(false);
      setNewRoomName('');
      setChannelId(0);
      await onFetchRooms();
    } catch (error) {
      console.error('채널 수정에 실패했습니다:', error);
    }
  };

  const onDeleteRoom = async (Id) => {
    try {
      await deleteRoom(Id);
      await leaveRoom();
      await onFetchRooms();
    } catch (error) {
      console.error('채널 삭제에 실패했습니다:', error);
    }
  };

  const joinRoom = async (roomId) => {
    if (currentRoom === roomId) return; // 이미 해당 방에 있으면 아무것도 하지 않음

    // 기존 방에 연결되어 있다면 먼저 연결 해제
    console.log(session);
    if (session) {
      leaveRoom();
    }

    const OV = new OpenVidu();
    const initSession = OV.initSession();

    initSession.on('streamCreated', (event) => {
      console.log('Stream created:', event.stream);
      const subscriber = initSession.subscribe(event.stream, undefined, {
        publishAudio: true,
        publishVideo: false
      });
      console.log('Subscriber:', subscriber);
      setSubscribers(prev => [...prev, subscriber]);
    });

    initSession.on('streamDestroyed', (event) => {
      console.log('Stream destroyed:', event.stream);
      setSubscribers(prev => prev.filter(sub => sub !== event.stream.streamManager));
    });

    try {
      const token = await getToken(roomId);
      console.log('Token received:', token);
      await initSession.connect(token, { clientData: nickname });
      console.log('Session connected');

      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: false,
        publishAudio: isMike,
        publishVideo: false,
      });
      console.log('Publisher initialized:', publisher);

      await initSession.publish(publisher);

      setSession(initSession);
      setPublisher(publisher);
      setCurrentRoom(roomId);
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const leaveRoom = useCallback(() => {
    if (session) {
      try {
        session.disconnect();
        console.log('Successfully left the room');
      } catch (error) {
        console.error('Error leaving room:', error);
        // 오류 발생 시에도 클라이언트 상태를 정리합니다.
      } finally {
        // 세션 상태를 항상 정리합니다.
        setSession(null);
        setPublisher(null);
        setSubscribers([]);
        setCurrentRoom(null);
      }
    }
  }, [session]);

  useEffect(() => {
    console.log('Current serverId:', serverId);
    if (serverId) {
      onFetchRooms();
    }
    return () => {
      if (session) leaveRoom();
    };
  }, [serverId, onFetchRooms, session, leaveRoom]);

  const handleToggle = useCallback((kind) => {
    if (publisher) {
      switch (kind) {
        case "mike":
          setIsMike(isMike => {
            const newIsMike = !isMike;
            publisher.publishAudio(newIsMike);
            return newIsMike;
          });
          break;
        case "speaker":
          setIsSpeaker(isSpeaker => {
              const newIsSpeaker = !isSpeaker;
              subscribers.forEach(s => s.subscribeToAudio(newIsSpeaker));
              return newIsSpeaker;
          });
          break;
      }
    }
    else {
      switch (kind) {
        case "mike":
          setIsMike(isMike => {
            const newIsMike = !isMike;
            return newIsMike;
          });
          break;
        case "speaker":
          setIsSpeaker(isSpeaker => {
            const newIsSpeaker = !isSpeaker;
            return newIsSpeaker;
          });
          break;
      }
    }
  }, [publisher, subscribers]);

  const getToken = async (roomId) => {
    try {
      const SessionId = {
        customSessionId: roomId
      }
      const sessionResponse = await initializeSession(SessionId);
      console.log('initSession :', sessionResponse.data);
      const sessionId = sessionResponse.data;

      const tokenResponse = await createConnection(sessionId);
      console.log('Connection created:', tokenResponse.data);
      return tokenResponse.data;
    } catch (error) {
      console.error('Error getting token:', error);
      throw error;
    }
  };

  return (
      <>
        <List>
          <ListItem>
            <Typography variant="caption" sx={{color: colors.grey[500]}}>음성 채널</Typography>
            <IconButton sx={{width: "20px", height: "20px", ml: "90px" }} onClick={() => setOpenCreateDialog(true)}>
              <AddIcon sx={{color: colors.grey[400], width: "15px", height: "15px", mr: "-60px"}}/>
            </IconButton>
          </ListItem>
          {rooms.map((room) => (
              <React.Fragment key={room.id}>
                <ListItem key={room.id} button onClick={() => joinRoom(room.id.toString())}>
                  <TagIcon fontSize="small" />
                  <ListItemText primary={room.name} />
                  {/*<IconButton*/}
                  {/*    sx={{width: "20px", height: "20px" }}*/}
                  {/*    onClick={(event) => {*/}
                  {/*      event.stopPropagation();*/}
                  {/*    }}*/}
                  {/*>*/}
                  {/*  <SettingsIcon sx={{color: colors.grey[400], width: "15px", height: "15px", mr: "-10px"}}/>*/}
                  {/*</IconButton>*/}
                  <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        setChannelId(room.id);
                        setOpenEditDialog(true);
                      }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteRoom(room.id)
                      }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItem>
                {currentRoom === room.id.toString() && (
                    <List component="div" disablePadding style={{paddingLeft: '20px'}}>
                      {publisher && (
                          <UserAudioComponent
                              streamManager={publisher}
                              isLocalUser={true}
                              handleToggle={handleToggle}
                              isMike={isMike}
                          />
                      )}
                      {subscribers.map((subscriber, index) => (
                          <UserAudioComponent
                              key={index}
                              streamManager={subscriber}
                              isLocalUser={false}
                          />
                      ))}
                    </List>
                )}
              </React.Fragment>
          ))}
        </List>
        {/* Create Channel Modal */}
        <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
          <DialogTitle>Create VoiceChannel</DialogTitle>
          <DialogContent>
            <TextField
                label="음성채널 이름"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
            <Button onClick={onCreateRoom}>Create</Button>
          </DialogActions>
        </Dialog>
        {/* edit Channel Modal */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>edit VoiceChannel</DialogTitle>
          <DialogContent>
            <TextField
                label="음성채널 이름"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button onClick={onEditRoom}>Edit</Button>
          </DialogActions>
        </Dialog>
        <BottomBar
            handleToggle={handleToggle}
            isMike={isMike}
            isSpeaker={isSpeaker}
            publisher={publisher}
            leaveRoom={leaveRoom}
        />
      </>
  );
};

export default VoiceChatComponent;