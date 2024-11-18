import React, { useState } from "react";
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Paper, TextField, Popover } from "@mui/material";
import { Add as AddIcon, EmojiEmotions as EmojiIcon } from "@mui/icons-material";
import * as colors from "@mui/material/colors";
import ProfilePage from "../../pages/voiceChats/profilePage";
import DMInput from "../../components/chatting/DMInput"; // DMInput 컴포넌트 임포트

const DmMessage = ({ selectedUserId, selectedUserName, loggedInUserId, loggedInUserName }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#E7EEE8",
        color: "white",
        overflow: "hidden", // 전체 레이아웃에서 넘치는 부분을 숨김,
      }}
    >
      {/* Main content */}
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: "hidden" }}>
        {/* Chatting message area */}

        <Box
          sx={{
            flexGrow: 1,
            bgcolor: "#E7EEE8",
            ml: 2,
            p: 2,
            overflowY: "auto",
            color: "#5A5A5B",
          }}
        >
          {[1, 2, 3, 4].map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ mr: 1 }} onClick={handleClick}>
                  이
                </Avatar>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "center",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "center",
                    horizontal: "left",
                  }}
                  sx={{ ml: "10px" }}
                >
                  <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
                </Popover>
                <Typography variant="subtitle1">이름</Typography>
                <Typography variant="caption" sx={{ ml: 1 }}>
                  보낸 시간
                </Typography>
              </Box>
              <Typography>채팅 내역</Typography>
            </Box>
          ))}
        </Box>

        {/* Messages input area */}
        <Box sx={{ p: 2 }}>
          <DMInput
            selectedUser={{ id: selectedUserId, name: selectedUserName }} // 선택된 사용자 ID와 이름을 전달
            senderId={loggedInUserId} // 선택된 사용자 ID 전달
            senderName={loggedInUserName} // 선택된 사용자 이름 전달
          />
        </Box>
      </Box>
      <ProfilePage />
    </Box>
  );
};

export default DmMessage;
