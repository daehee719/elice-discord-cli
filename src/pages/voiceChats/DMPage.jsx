import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItemAvatar,
  ListItemText,
  Badge,
  styled,
  ListItemButton,
} from "@mui/material";
import * as colors from "@mui/material/colors";
import DmMessage from "../../components/voiceChat/DmMessage";
import FriendshipTab from "../../components/userFeature/Friendship/FriendshipTab";
import FriendRequestTab from "../../components/userFeature/FriendRequest/FriendRequestTab";
import BlockTab from "../../components/userFeature/Block/BlockTab";
import ReportTab from "../../components/userFeature/Report/ReportTab";
import AdminReportTab from "../../components/userFeature/Admin/AdminReportTab";
import AdminUserManageTab from "../../components/userFeature/Admin/AdminUserManageTab";
import DMHeader from "../../components/chatting/DMHeader";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: colors.green["A400"],
    color: colors.green["A400"],
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const DMPage = () => {
  const [currentView, setCurrentView] = useState("friends");
  const [alignment, setAlignment] = React.useState("left");
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // 선택된 사용자 ID
  const [selectedUserName, setSelectedUserName] = useState(""); // 선택된 사용자 이름

  // 로컬스토리지에서 사용자 정보 가져오기
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const loggedInUserId = userInfo?.userId; // 유저 아이디
  const loggedInUserName = userInfo?.nickname; // 유저 이름 또는 닉네임

  console.log(loggedInUserId, loggedInUserName);

  useEffect(() => {
    const savedTab = localStorage.getItem("selectedTab") || "dm";
    setCurrentView(savedTab);
  }, []);

  const renderComponent = () => {
    switch (currentView) {
      case "dm":
        return (
          <DmMessage
            selectedUserId={selectedUserId}
            selectedUserName={selectedUserName}
            loggedInUserId={loggedInUserId} // 로그인한 사용자 ID 전달
            loggedInUserName={loggedInUserName} // 로그인한 사용자 이름 전달
          />
        );
      case "friends":
        return <FriendshipTab />;
      case "friend-requests":
        return <FriendRequestTab />;
      case "blocks":
        return <BlockTab />;
      case "reports":
        return <ReportTab />;
      case "report-manage":
        return <AdminReportTab />;
      case "user-manage":
        return <AdminUserManageTab />;
      default:
        return <FriendshipTab />;
    }
  };

  console.log("테스트페이지 랜더링 성공");
  console.log(`Current view: ${currentView}`);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleListItemClick = (event, index, userId, userName) => {
    setSelectedIndex(index);
  };

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#C2D6C6",
        color: "white",
      }}
    >
      {/* friend list sidebar */}
      <Box
        sx={{ mt: "80.5px", color: "#5A5A5B", width: 240, bgcolor: "#C2D6C6", p: 2, borderTop: "1px solid #88AA8D" }}
      >
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          다이렉트 메세지
        </Typography>
        <List>
          {["이름", "이름1", "이름", "이름"].map((name, index) => (
            <ListItemButton
              key={index}
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(event, index)}
            >
              <ListItemAvatar>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                >
                  <Avatar>{name[0]}</Avatar>
                </StyledBadge>
              </ListItemAvatar>
              <ListItemText primary={name} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* Main content */}
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, overflowY: "auto" }}>
        <DMHeader onViewChange={setCurrentView} />
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default DMPage;
