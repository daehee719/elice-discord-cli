// src/api/reactionApi.js
import { httpClient } from "../httpClient";

// 리액션 추가 (HTTP 요청)
export const addReaction = (messageId, emoji) => {
    return httpClient.post('/reactions', null, {
        params: {
            messageId,
            emoji
        }
    });
};

// 특정 메시지에 대한 리액션 가져오기 (HTTP 요청)
export const getReactionsByMessageId = (messageId) => {
    return httpClient.get(`/reactions/${messageId}`);
};

// 리액션 삭제 (HTTP 요청)
export const deleteReaction = (id) => {
    return httpClient.delete(`/reactions/${id}`);
};
