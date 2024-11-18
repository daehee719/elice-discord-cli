import axios from "axios";

// AXIOS 객체 생성 : 모든 요청에 적용되는 http 설정이다.
export const httpClient = axios.create({
  // 기본 api 요청 대상 : 스프링부트 api 서버
  baseURL: `http://52.78.43.93:80`,
  // 요청에 대한 응답이 5초 이내로 오지 않으면 요청이 자동으로 취소된다.
  timeout: 13000,
  // 다른 도메인에 대한 요청을 할 때에, 쿠키와 인증 관련 정보를 서버에게 보낼 것인가 여부
  withCredentials: true,
  /* HTTP 요청 헤더 설정사항
    headers: {
      'Content-Type': 'application/json',
    },*/
});

httpClient.interceptors.request.use(
  (config) => {
    // debug용 URL을 콘솔에 출력
    console.log(`Request made to URL: ${config.url}`);

    // debug용 요청 데이터(body)가 존재하는 경우 출력
    if (config.data) {
      console.log("Request Data:", JSON.stringify(config.data));
    } else {
      console.log("No Request Data");
    }

    // Access Token이 존재하면 Authroization header에 설정
    const token = localStorage.getItem("accessToken");

    console.log(token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      setAccessTokenToHttpClient(token);
    }
    return config;
  },
  // 만약 요청에 실패할 경우 에러를 반환하여, 함수를 호출한 곳에서 에러처리를 할 수 있도록 한다.
  (error) => {
    return Promise.reject(error);
  }
);

// // Interceptor를 통해 요청 후 수행할 추가적인 작업 설정
// httpClient.interceptors.response.use(
//     // 요청이 성공적으로 수행되었을 때는 그대로 응답을 반환
//     (response) => response,

//     // 요청이 실패하였을 경우
//     async (error) => {

//         // 응답이 없을 경우, 즉 네트워크 오류가 발생한 경우
//         if (!error.response) {
//             console.error('Network Error:', error);
//             return Promise.reject(error);
//         }

//         // 네트워크 오류 이외의 원인으로 실패하였다면 재전송
//         // 직전 요청을 변수에 저장.
//         const originalRequest = error.config;
//         // 오류 응답의 상태코드.
//         const status = error.response?.status;

//         // 만약 인증 실패와 관련된 오류이면서, 이 요청이 한 번도 재시도 되지 않았다면
//         if (status === 401 && !originalRequest._retry) {
//             // 딱 한번만 더 요청을 재 시도한다.
//             originalRequest._retry = true;
//             try {
//                 // 서버에서 재 발급한 access_token을 가져오기 위해 authorization header저장
//                 const authorizationHeader = error.response.headers['authorization'];

//                 // 만약 서버에서 access token을 재발급한게 맞다면
//                 if (authorizationHeader) {

//                     console.log('Old Access Token:', localStorage.getItem('accessToken'));

//                     // 새로운 액세스토큰 발급 후 디버깅용 출력
//                     const newAccessToken = authorizationHeader.split(' ')[1];
//                     console.log('New Access Token:', newAccessToken);

//                     // 새로운 액세스 토큰으로 갱신
//                     localStorage.setItem('accessToken', newAccessToken);

//                     // 새로운 액세스 토큰을 서버로 보내서 다시 요청한다.
//                     originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//                     setAccessTokenToHttpClient(newAccessToken);

//                     // 원래의 요청을 재전송
//                     return httpClient(originalRequest);
//                 } else {
//                     console.error('Authorization header is not present');
//                 }
//             } catch (refreshError) {
//                 console.error('Token refresh failed:', refreshError);
//                 return Promise.reject(refreshError);
//             }
//         }
//         return Promise.reject(error);
//     },
// );

// 모든 요청에 대하여 access token을 설정하는 사용자 정의 함수
export const setAccessTokenToHttpClient = (accessToken) => {
  httpClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};
