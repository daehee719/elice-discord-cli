import { httpClient } from "../httpClient";

// 사용자 계정 삭제 / 생성
export const register = (req) => {
  return httpClient.post('/users', req);
};

export const deleteUser = () => {
  return httpClient.delete('/users');
};

// 사용자 프로필 이미지 변경
export const changeProfileImage = (file) => {
  return httpClient.patch("/users/profile", file)
}


export const sendVerificationCode = (req) => {
  return httpClient.post(`/mails`, req)
}

export const checkVerificationCode = (email, code) => {
  return httpClient.get(`/mails?email=${email}&code=${code}`)
}

// 사용자의 패스워드 관련 api 
export const checkPassword = (req) => {
  return httpClient.post(`/users/password`, req)
}

export const changePassword = (req) => {
  return httpClient.patch(`/users/password`, req)
}

// 사용자의 이메일 관련 api
export const checkEmail = (req) => {
  return httpClient.post(`/users/email`, req)
}


// 사용자의 닉네임 관련 api
export const checkNickname = (req) => {
  return httpClient.post(`/users/nickname`, req)
}

export const changeNickname = (req) => {
  return httpClient.patch("/users/nickname", req)
}

// 사용자 계정 비활성화 / 활성화 관련 api
export const deactivateUser = () => {
  return httpClient.patch("/users/activated", {"activated" : false})
}

export const activateUser = () => {
  return httpClient.patch("/users/activated", {"activated" : true})
}