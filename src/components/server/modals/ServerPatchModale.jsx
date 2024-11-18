import React, { useState, useEffect } from "react";
import { Box, IconButton, Divider, Tooltip, Modal, Typography, TextField, Button } from "@mui/material";
import { patchServer } from "../../api/server/serverApi";
import { useNavigate, useLocation } from "react-router-dom";

const ServerPatchModal = (id) => {
  const location = useLocation();
  const sid = location.state.id;
  const [modalON, setModalOn] = useState(false);
  const [newServerName, setNewServerName] = useState(""); // 서버 이름을 상태로 관리
  const handleClose = () => {
    setModalOn(false); // 모달을 닫기 위해 상태를 false로 설정
    setNewServerName(""); // 모달 닫을 때 입력 필드 초기화
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
    pt: 2,
    px: 4,
    pb: 3,
  };

  return (
    <Modal
      open={modalON}
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
        <Button variant="contained" onClick={() => patchServer(sid)}>
          생성
        </Button>
      </Box>
    </Modal>
  );
};

export default ServerPatchModal;
