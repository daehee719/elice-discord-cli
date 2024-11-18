import { httpClient } from "../httpClient";

// 서버 ID에 해당하는 모든 채널 가져오기
export const getChannels = (serverId) => {
    return httpClient.get(`/api/channels/server/${serverId}`);
};

// 새로운 채널 생성하기
export const createChannel = (channelData) => {
    // channelData는 { name: "채널이름", serverId: "서버ID" } 형태여야 합니다.
    return httpClient.post("/api/channels", channelData);
};

// 채널 정보 업데이트하기
export const updateChannel = (channelId, newName) => {
    return httpClient.put(`/api/channels/${channelId}`, newName, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
};

// 채널 삭제하기
export const deleteChannel = (channelId) => {
    return httpClient.delete(`/api/channels/${channelId}`);
};