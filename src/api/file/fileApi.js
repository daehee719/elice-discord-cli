// src/api/fileApi.js
import { httpClient } from "../httpClient";

// 파일 업로드
export const uploadFile = (file, fileRequestDto) => {
    const formData = new FormData();
    formData.append('file', file);

    for (const key in fileRequestDto) {
        formData.append(key, fileRequestDto[key]);
    }

    return httpClient.post('/files/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

// 파일 삭제
export const deleteFile = (fileKey) => {
    return httpClient.delete(`/files/delete/${fileKey}`);
};

// 파일 전체리스트 조회
export const listFiles = () => {
    return httpClient.get('/files/list');
};

// 파일 다운로드
export const downloadFile = (fileKey, downloadFileName = null) => {
    const params = downloadFileName ? { downloadFileName } : {};
    return httpClient.get(`/files/download/${fileKey}`, {
        params,
        responseType: 'blob',
    });
};

export const generatePresignedUrl = (fileName) => {
    return httpClient.get(`/files/presigned-url/${fileName}`);
};

export const listFilesByChannelId = (channelId) => {
    return httpClient.get(`/files/channel/${channelId}`);
}

export const listFilesByUserId = (userId) => {
    return httpClient.get(`/files/user/${userId}`);
}

export const listFilesByMessageId = (messageId) => {
    return httpClient.get(`/files/message/${messageId}`);
}