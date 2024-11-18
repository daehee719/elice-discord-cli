
import { httpClient, setAccessTokenToHttpClient } from "./httpClient";

export const login = async (req) => {
    const response = await httpClient.post('/apiLogin', req);
    return response;
};
  
export const transferJWTTokenFromCookieToHeader = async () => {
    const response = await httpClient.get("/afterSocialLogin");
    return response
}