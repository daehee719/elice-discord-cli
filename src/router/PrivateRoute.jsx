import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from 'js-cookie';


export const PrivateRoute = () => {

  const isAuthenticated = () => {

    // 액세스 토큰의 발급 여부 확인
    const accessToken = localStorage.getItem("accessToken");

    // 액세스 토큰이 존재하지 않는다면
    if(accessToken === null){
      console.log("access token not exist")
      return false;
    }

    console.log("access token exist")
    return true;
  }

  // 액세스 토큰이 있다면 그대로 하위 컴포넌트 출력
  // 액세스 토큰이 없다면 다음 컴포넌트를 출력
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

