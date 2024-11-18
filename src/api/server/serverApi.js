import { httpClient } from "../httpClient";

export const postServer = (req) => {
  return httpClient.post("/server", { name: req });
};

export const getServers = () => {
  return httpClient.get("/servers");
};

export const getServer = (id) => {
  return httpClient.get(`/server?id=${id}`);
};

export const patchServer = (id, req) => {
  return httpClient.patch(`/server?id=${id}`, { name: req });
};

export const deleteServer = (id) => {
  return httpClient.delete(`/server?id=${id}`);
};

export const inviteServer = (code) => {
  return httpClient.get(`/server/invite?code=${code}`);
};
