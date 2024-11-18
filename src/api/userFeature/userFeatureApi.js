import { httpClient } from "../httpClient";

// 사용자 검색
export const searchUsers = (keyword) => {
    return httpClient.get(`/users/search`, {params: {keyword}});
}

// 차단
export const blockUser = (userId) => {
    return httpClient.post(`/users/${userId}/block`);
}

export const getBlocks = () => {
    return httpClient.get("/blocks");
}

export const unblockUser = (blockId) => {
    return httpClient.delete(`/blocks/${blockId}`);
}

// 친구 요청
export const sendFriendRequest = (userId) => {
    return httpClient.post(`/users/${userId}/friend-request`);
};

export const getFriendRequests = (status) => {
    return httpClient.get("/friend-requests", {params: {status}});
};

export const responseFriendRequest = (friendRequestId, status) => {
    return httpClient.patch(`/friend-requests/${friendRequestId}`, null, {params: {status}});
};

export const deleteFriendRequest = (friendRequestId) => {
    return httpClient.delete(`/friend-requests/${friendRequestId}`);
};


// 친구 관계
export const getFriends = () => {
    return httpClient.get("/friendships");
};

export const searchFriends = (keyword) => {
    return httpClient.get("/friendships/search", {params: {keyword}});
};

export const deleteFriendship = (friendshipId) => {
    return httpClient.delete(`/friendships/${friendshipId}`);
};

// 유저 - 신고
export const reportUser = (userId, formData) => {
    return httpClient.post(`/users/${userId}/report`, formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getReports = (reportStatus) => {
    return httpClient.get("/reports", {params: {reportStatus}});
};

export const getReportImage = (reportId) => {
    return httpClient.get(`/reports/${reportId}/image`);
};

export const editReport = (reportId, formData) => {
    return httpClient.put(`/reports/${reportId}`, formData,{
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const deleteReport = (reportId) => {
    return httpClient.delete(`/reports/${reportId}`);
};

// 관리자 - 신고
export const adminGetReports = (reportStatus) => {
    return httpClient.get("/admin/reports", {params: {reportStatus}});
};

export const adminDetailReport = (reportId) => {
    return httpClient.get(`/admin/reports/${reportId}`);
}

export const adminResponseReport = (reportId, reportStatus) => {
    return httpClient.patch(`/admin/reports/${reportId}`, null, {params: {reportStatus}});
}

// 관리자 - 회원 관리
export const adminGetUsers = () => {
    return httpClient.get("/admin/users");
};

export const adminEditUserRole = (userId, role) => {
    return httpClient.patch(`/admin/users/${userId}`, null, {params: {role}});
}

export const adminDeleteUser = (userId) => {
    return httpClient.delete(`/admin/users/${userId}`);
}