import React, { useState, useEffect } from "react";
import { Box, Divider, Tooltip, Modal, Typography, TextField, Button, Avatar } from "@mui/material";
import { postServer, getServers, getServer } from "../../api/server/serverApi";
import { useLocation, useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import spatz from "../../../public/images/spatz.png";
import spatzz from "../../../public/images/spatzz.png";


const ServerListComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [serverList, setServerList] = useState([]);
  const [modalON, setModalOn] = useState(false);
  const [newServerName, setNewServerName] = useState(""); // 서버 이름을 상태로 관리
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태를 상태로 관리
  const [currentTitle, setCurrentTitle] = useState('');

  // 로그인 상태에 따른 서버 리스트 및 추가 버튼 표시
  const checkToCreateServer = () => {
    if (isLoggedIn) {
      showCreateServerModal();
    } else {
      navigate("/login"); // 로그인 페이지로 리다이렉션
    }
  };

  const getServerInfo = async (id) => {
    try {
      const res = await getServer(id);
      console.log(res.data);
      navigate("/ChattingPage", { state: { id: res.data.id, name: res.data.name } });
    } catch (error) {
      console.error("서버 로드 중 오류 발생:", error);
    }
  };

  const createServer = async (name) => {
    try {
      handleClose();
      const res = await postServer(name);
      console.log(res.data);
      const newData = res.data;
      getServerList(newData);
      handleClose(); // 서버 생성 후 모달 닫기
    } catch (error) {
      console.error("서버 생성 중 오류 발생:", error);
    }
  };

  const getServerList = async (newData) => {
    try {
      const res = await getServers();
      console.log(res.data);
      const serverData = Array.isArray(res.data) ? res.data : []; // 배열 여부를 확인하여 설정

      if (newData) {
        const updatedList = [...serverData, newData].filter((server, index, self) =>
          index === self.findIndex((s) => s.id === server.id)
        );
      setServerList(updatedList);
        // setServerList([...serverData, newData]); // 새로운 서버 데이터를 기존 리스트에 추가
      } else {
        setServerList(serverData); // 초기 로드 시 서버 리스트 설정
      }
      console.log(serverData);
    } catch (error) {
      console.error("서버 로드 중 오류 발생:", error);
    } finally {
    }
  };

  useEffect(() => {
    getServerList();
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);

    // 현재 경로에 따라 Tooltip 타이틀 초기화
    const currentPath = location.pathname;
    if (!isLoggedIn) {
      if (currentPath === '/login') {
        setCurrentTitle('메인페이지로 이동');
      } else {
        setCurrentTitle('로그인페이지로 이동');
      }
    } else {
      if (currentPath === '/') {
        setCurrentTitle('DM페이지로 이동');
      } else {
        setCurrentTitle('메인페이지로 이동');
      }
    }
  }, [location.pathname, isLoggedIn]);

  const showCreateServerModal = () => {
    setModalOn(true); // 모달을 열기 위해 상태를 true로 설정
  };

  const handleClose = () => {
    setModalOn(false); // 모달을 닫기 위해 상태를 false로 설정
    setNewServerName(""); // 모달 닫을 때 입력 필드 초기화
  };

  const handleLogoClick = () => {
    const currentPath = location.pathname;

    if (!isLoggedIn) {
      if (currentPath === '/'){
        navigate("/login");
      }
      if (currentPath === '/login'){
        navigate("/");
      } 
    } else {
      if (currentPath === '/'){
        navigate("/dmPage");
      }
      else {
        navigate("/");
      }
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Modal
        open={modalON}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            서버 생성
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            새로운 서버를 생성하려고 합니다.
          </Typography>
          <TextField
            hiddenLabel
            id="filled-hidden-label-small"
            value={newServerName} // 상태를 value로 바인딩
            onChange={(event) => {
              setNewServerName(event.target.value);
            }}
            variant="filled"
            size="small"
            placeholder="서버 이름을 입력하세요!"
          />
          <Button variant="contained" onClick={() => createServer(newServerName)}>
            생성
          </Button>
        </Box>
      </Modal>

      <Box
        sx={{
          minWidth: 80,
          bgcolor: '#88AA8D',
          borderRight: 1,
          borderColor: '#5D8363',
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 2,
          height: "100vh", // 화면 전체 높이
        }}
      >
        <Tooltip title = {currentTitle} placement="right">
          <Avatar
            src={spatz}
            sx={{
              color: '#E7EEE8',
              bgcolor: '#88AA8D',
              width: 50,
              height: 50,
              mb: 1,
              fontSize: 12,
            }}
            onClick={handleLogoClick}
          />
        </Tooltip>

        {/* 로그인했을 때만 서버 리스트와 서버 추가 버튼 표시 */}
        {isLoggedIn && (
          <>
            {serverList.length > 0 && (
              <Divider sx={{ width: "50%", my: 1, bgcolor: '#5D8363' }} />
            )}
            {serverList.map((server, index) => (
              <Tooltip title={server.name} placement="right" key={`${server.id}-${index}`}>
                <Avatar
                  sx={{
                    color: '#E7EEE8',
                    bgcolor: '#5D8363',
                    width: 50,
                    height: 50,
                    "&:hover": { bgcolor:'#4A654E' },
                    marginBottom: 1,
                  }}
                  onClick={() => getServerInfo(server.id)}
                >
                  {server.name[0]}
                </Avatar>
              </Tooltip>
            ))}
            <Divider sx={{ width: "50%", my: 1, bgcolor: '#5D8363' }} />
            <Tooltip title="서버 추가" placement="right">
              <Avatar
                sx={{
                  color: '#E7EEE8',
                  bgcolor: '#5D8363',
                  width: 50,
                  height: 50,
                  "&:hover": { bgcolor:'#4A654E' },
                }}
                onClick={checkToCreateServer}
              >
                <AddIcon />
              </Avatar>
            </Tooltip>
          </>
        )}
      </Box>
    </>
  );
};

export default ServerListComponent;

