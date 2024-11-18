// src/api/reactionApi.js
import { httpClient } from "../httpClient";

// ���׼� �߰� (HTTP ��û)
export const addReaction = (messageId, emoji) => {
    return httpClient.post('/reactions', null, {
        params: {
            messageId,
            emoji
        }
    });
};

// Ư�� �޽����� ���� ���׼� �������� (HTTP ��û)
export const getReactionsByMessageId = (messageId) => {
    return httpClient.get(`/reactions/${messageId}`);
};

// ���׼� ���� (HTTP ��û)
export const deleteReaction = (id) => {
    return httpClient.delete(`/reactions/${id}`);
};
