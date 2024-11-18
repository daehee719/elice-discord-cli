import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ServerListComponent from "./ServerListComponent";
import ServerInfoComponent from "./ServerInfoComponent";
import { getServers, postServer, getServer, patchServer, deleteServer } from "../../api/server/serverApi";

const ServerManagement = () => {
  const [serverList, setServerList] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const res = await getServers();
        setServerList(res.data);
      } catch (error) {
        console.error("서버 로드 중 오류 발생:", error);
      }
    };
    fetchServers();
  }, []);

  const handleCreateServer = async (name) => {
    try {
      const res = await postServer(name);
      setServerList([...serverList, res.data]);
    } catch (error) {
      console.error("서버 생성 중 오류 발생:", error);
    }
  };

  const handlePatchServer = async (id, newName) => {
    try {
      await patchServer(id, newName);
      setServerList(serverList.map((server) => (server.id === id ? { ...server, name: newName } : server)));
    } catch (error) {
      console.error("서버 수정 중 오류 발생:", error);
    }
  };

  const handleDeleteServer = async (id) => {
    try {
      await deleteServer(id);
      setServerList(serverList.filter((server) => server.id !== id));
    } catch (error) {
      console.error("서버 삭제 중 오류 발생:", error);
    }
  };

  const handleSelectServer = async (id) => {
    try {
      const res = await getServer(id);
      setSelectedServer(res.data);
    } catch (error) {
      console.error("서버 선택 중 오류 발생:", error);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <ServerListComponent
        serverList={serverList}
        onCreateServer={handleCreateServer}
        onSelectServer={handleSelectServer}
      />
      {selectedServer && (
        <ServerInfoComponent
          server={selectedServer}
          onPatchServer={handlePatchServer}
          onDeleteServer={handleDeleteServer}
        />
      )}
    </Box>
  );
};

export default ServerManagement;
