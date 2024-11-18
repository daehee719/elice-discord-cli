import ServerInfoComponent from "../../components/server/ServerInfoComponent";
import React, { useEffect, useRef, useState } from "react";
import { Container, Typography, Box, Button, TextField } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {ChattingPage} from "../voiceChats/index.js";
const ServerPage = () => {
  const location = useLocation();
  const id = location.state.id;
  const name = location.state.name;
  console.log("name:", name);
  return <ChattingPage id={id} name={name} />;
};

export default ServerPage;
