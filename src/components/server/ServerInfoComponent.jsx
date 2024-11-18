import React, { useState } from "react";
import { Box, Button, Divider, Modal, Typography, TextField, Menu, MenuItem } from "@mui/material";
import * as colors from "@mui/material/colors";
import { useNavigate, useLocation } from "react-router-dom";
import { patchServer, deleteServer, getServer } from "../../api/server/serverApi";
import ServerListComponent from "./ServerListComponent";

const ServerInfoComponent = ({ name }) => {
  const location = useLocation();
  const nav = useNavigate();
  const serverId = location.state.id;

  // ============서버 이름 변경 변수============
  const [patchModalON, setPatchModalON] = useState(false);
  const [newServerName, setNewServerName] = useState(""); // 서버 이름을 상태로 관리
  const handleClose = () => {
    setPatchModalON(false); // 모달을 닫기 위해 상태를 false로 설정
    setNewServerName(""); // 모달 닫을 때 입력 필드 초기화
  };

  const getServerInfo = async (id) => {
    try {
      const res = await getServer(id);
      console.log(res.data);
      nav("/serverPage", { state: { id: res.data.id, name: res.data.name } });
    } catch (error) {
      console.error("서버 로드 중 오류 발생:", error);
    }
  };

  const deleteServerbyid = async (id) => {
    try {
      await deleteServer(id);
      nav("/"); // 삭제 후 메인 페이지로 리디렉션
      location.reload();
    } catch (error) {
      console.error("서버 삭제 중 오류 발생:", error);
    }
  };

  // ============서버 삭제 변수============
  const [deleteModalON, setDeleteModalON] = useState(false);
  const [cdeleteModalON, csetDeleteModalON] = useState(false);

  // Menu 관련 상태 및 핸들러
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const patchServerName = () => {
    handleMenuClose();
    setPatchModalON(true);
  };

  const mdeleteServer = () => {
    handleMenuClose();
    setDeleteModalON(true);
  };

  const mchildDeleteServer = () => {
    csetDeleteModalON(true);
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
    <Box
      sx={{
        width: 200,
        bgcolor: "grey.400",
        borderRight: 1,
        borderColor: "grey.800",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2,
        height: "100vh", // 화면 전체 높이
      }}
    >
      {name}
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        설정
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={patchServerName}>수정</MenuItem>
        <MenuItem onClick={mdeleteServer}>삭제</MenuItem>

        <Modal
          open={patchModalON}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              서버 수정
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              서버를 수정하려고 합니다.
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
            <Button
              variant="contained"
              onClick={() => {
                patchServer(serverId, newServerName);
                getServerInfo(serverId);
                console.log(ServerListComponent.serverList);
                handleClose();
              }}
            >
              변경
            </Button>
          </Box>
        </Modal>

        <Modal
          open={deleteModalON}
          onClose={() => setDeleteModalON(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              서버 삭제
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              서버를 삭제하려고 합니다.
            </Typography>
            <Button variant="contained" onClick={mchildDeleteServer}>
              삭제
            </Button>
            <Box>
              <Modal
                open={cdeleteModalON}
                onClose={() => csetDeleteModalON(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      deleteServerbyid(serverId);
                    }}
                  >
                    진짜요?
                  </Button>
                  <Button onClick={() => csetDeleteModalON(false)}>아니용</Button>
                </Box>
              </Modal>
            </Box>
          </Box>
        </Modal>
      </Menu>
      <Divider sx={{ width: "80%", my: 1, bgcolor: colors.grey[800] }} />
    </Box>
  );
};

export default ServerInfoComponent;
