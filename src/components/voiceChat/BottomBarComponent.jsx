import React, {useCallback} from 'react';
import {Box, Avatar, IconButton, Tooltip, Typography} from '@mui/material';
import {Mic, MicOff, Headset, Settings, HeadsetOff, Call, GraphicEq } from '@mui/icons-material';
import * as colors from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const BottomBar = ( {username, publisher, handleToggle, isMike, isSpeaker, leaveRoom} ) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))
  const navigate = useNavigate();
  const {email, nickname} = userInfo
  const handleSettings = () => {
    navigate('/mypage');

  }
  console.log("publisher: ", publisher);
  return (
      <Box>
        {publisher && (
            <Box sx={{
              position: 'absolute',
              height: "52px",
              width: "221px",
              fontSize: '12px',
              bottom: "52px",
              backgroundColor: colors.grey[900]
            }}>
              <GraphicEq sx={{
                color: colors.green["A200"],
                width: "30px",
                height: "30px",
                marginLeft: 1,
                mt: "10px"
              }}/>
              <Typography variant="caption" sx={{
                position: 'absolute',
                color: colors.green["A200"],
                ml: 1,
                top: "12px",
                fontSize: "16px",
                fontWeight: 'bold'
              }}>음성 연결됨</Typography>
              <IconButton onClick={() => leaveRoom()} sx={{
                position: 'absolute',
                color: 'white',
                width: "30px",
                height: "30px",
                right: 10,
                mt: "10px"
              }}>
                <Call />
              </IconButton>
            </Box>
        )}
        <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: "81px",
              right: 0,
              height: '52px',
              width: "201px",
              backgroundColor: colors.grey[900],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 10px',
              borderTop: `1px solid ${colors.grey[800]}`,
            }}
        >
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Avatar
                alt={username}
                sx={{width: 32, height: 32, marginRight: 1}}
            />
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
              <Box sx={{color: 'white', fontSize: '14px'}}>{nickname}</Box>
              <Box sx={{color: colors.grey[400], fontSize: '12px'}}>
                온라인
              </Box>
            </Box>
          </Box>
          <Box>
            <Tooltip title={isMike ? "마이크 끄기" : "마이크 켜기"}>
              <IconButton onClick={() => handleToggle("mike")} sx={{
                color: isMike ? 'white' : colors.red[500],
                width: "30px",
                height: "30px"
              }}>
                {isMike ? <Mic/> : <MicOff/>}
              </IconButton>
            </Tooltip>
            <Tooltip title={isSpeaker ? "헤드셋 음소거" : "헤드셋 음소거 해제하기"}>
              <IconButton onClick={() => handleToggle("speaker")} sx={{
                color: isSpeaker ? 'white' : colors.red[500],
                width: "30px",
                height: "30px"
              }}>
                {isSpeaker ? <Headset/> : <HeadsetOff/>}
              </IconButton>
            </Tooltip>
            <Tooltip title="사용자 설정">
              <IconButton onClick={() => handleSettings()}
                          sx={{color: 'white', width: "30px", height: "30px"}}>
                <Settings/>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
  );

};

export default BottomBar;