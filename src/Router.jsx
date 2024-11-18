import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "./pages/error";
import RegisterForm from "./pages/users/RegisterForm";
import { LoginForm, RegisterComplete, FindPassword, ResetPassword, MyPage, ResetNickname } from "./pages/users";
import { PrivateRoute } from "./router/PrivateRoute";
import { ChattingPage, DMPage } from "./pages/voiceChats/";
import JWTTokenTransfer from "./pages/users/JWTTokenTransfer";
import ServerListComponent from "./components/server/ServerListComponent";
import ServerPage from "./pages/server/ServerPage";
import MainPage from "./pages/main/MainPage";
import InvitePage from "./pages/server/InvitePage";

const Router = () => {
  const isAuthenticated = true;

  console.log("Router rendering");

  return (
    <div style={{ display: "flex" }}>
      {/* 인증된 사용자에게만 ServerListComponent를 렌더링 */}
      {isAuthenticated && <ServerListComponent />}

      {/* 나머지 페이지들 */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/login" element={<LoginForm />}></Route>
          <Route path="/jwtTokenTransfer" element={<JWTTokenTransfer />}></Route>
          <Route path="*" element={<MainPage />}></Route>
          {/* 인증된 사용자만 접근 가능한 페이지는 다음 라우트 안에 추가 부탁드립니다 */}

          <Route element={<PrivateRoute />}>
            <Route path="/myPage" element={<MyPage />}></Route>
            <Route path="/resetNickname" element={<ResetNickname />}></Route>
            <Route path="/resetPassword" element={<ResetPassword />}></Route>
          </Route>
          <Route path="/findPassword" element={<FindPassword />}></Route>
          <Route path="/register" element={<RegisterForm />}></Route>
          <Route path="/registerComplete" element={<RegisterComplete />}></Route>
          <Route path="/ChattingPage" element={<ChattingPage />}></Route>
          <Route path="/dmPage" element={<DMPage />}></Route>
          <Route path="/serverPage" element={<ServerPage />}></Route>
          <Route path="/invitePage/:code" element={<InvitePage />}></Route>
          <Route path="*" element={<NotFoundPage />}></Route>
        </Routes>
      </div>
    </div>
  );
};

export default Router;
