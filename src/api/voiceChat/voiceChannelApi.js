import { httpClient } from "../httpClient";

export const fetchRooms = (serverId) => {
  return httpClient.get(`/voiceChannels/server/${serverId}`, {});
};

export const createRoom = (req) => {
  return httpClient.post('/voiceChannels', req);
};

export const updateRoom = (voiceChannelId, req) => {
  return httpClient.put(`/voiceChannels/${voiceChannelId}`, req, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};

export const deleteRoom = (voiceChannelId) => {
  return httpClient.delete(`/voiceChannels/${voiceChannelId}`, {});
};


export const initializeSession = (req) => {
  return httpClient.post('/openvidu/sessions', req);
}

export const createConnection = (req) => {
  return httpClient.post(`/openvidu/sessions/${req}/connections`, {});
}
