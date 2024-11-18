import ServerInfoComponent from "../../components/server/ServerInfoComponent";
import React, { useEffect, useRef, useState } from "react";
import { Container, Typography, Box, Button, TextField } from "@mui/material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ChattingPage } from "../voiceChats/index.js";
import { getServer, inviteServer } from "../../api/server/serverApi.js";
const InvitePage = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  console.log(code);

  const invite = async () => {
    try {
      const res = await inviteServer(code);
      const serverInfo = await getServer(res.data.serverId);
      console.log(res);
      navigate("/ChattingPage", { state: { id: serverInfo.data.id, name: serverInfo.data.name } });
    } catch (error) {
      console.error("서버 로드 중 오류 발생:", error);
    } finally {
    }
  };
  invite();
};

export default InvitePage;
