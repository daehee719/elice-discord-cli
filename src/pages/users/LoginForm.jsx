import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, TextField, Button } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";
import { checkEmail } from "../../api/user/userApi";
import { jwtDecode } from "jwt-decode";

const API_SERVER = "http://localhost:8080";

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);

  // 로그인 입력값 검증 후 설정되는 예외 메시지
  const [exceptionMsg, setExceptionMsg] = useState("");

  const handleEmailInput = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordInput = (event) => {
    setPassword(event.target.value);
  };

  // 비밀번호 찾기 버튼 클릭 시 실행 되는 부분
  const onClickFindPassword = async (event) => {
    const data = {
      email,
    };

    // 입력한 이메일에 해당하는 사용자가 있는 지 여부 체크
    try {
      const response = await checkEmail(data);

      // findPassword 페이지로 리다이렉션 실시
      navigate("/findPassword", { state: { email } });
    } catch (error) {
      console.log(error);
      // 사용자가 존재하지 않을 경우 404 error
      if (error.response.data.code === "U003") {
        setIsEmailInvalid(true);
      }
    }
  };

  //로그인 버튼 입력 시 실행 되는 부분
  const onClickLoginButton = async (event) => {
    event.preventDefault();

    const loginData = {
      username: email,
      password: password,
    };

    try {
      const response = await login(loginData);

      // 로그인 후 처리 (예: 페이지 이동 등)
      if (response.status === 200) {
        console.log("로그인 성공");
        // 필요한 경우 추가 처리
        const { profileImage, accessToken, refreshToken } = response.data;
        console.log("response.data:" + response.data);

        // Access + Refresh Token을 로컬 스토리지에 저장
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // JWT를 디코딩하여 정보 추출하고 로컬스토리지에 저장
        const payload = jwtDecode(accessToken);
        const { userId, nickname, email, role } = payload;
        const userInfo = { userId, nickname, email, role, profileImage };
        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        // 홈 페이지로 이동
        navigate("/");
      }
    } catch (error) {
      // 입력한 이메일이 유효하지 않을 경우
      if (error.response.data.code && ["U003", "U007"].includes(error.response.data.code)) {
        setExceptionMsg("이메일 혹은 비밀번호가 올바르지 않습니다");
        // 입력한 비밀번호가 유효하지 않을 경우
      } else {
        setExceptionMsg(error.response.data);
      }
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex", // Flexbox 사용
        width: "100%", // 부모 요소의 너비를 100% 차지
        height: "100vh", // 부모 요소의 높이를 100vh로 설정 (전체 화면 높이)
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        backgroundImage: 'url("images/user_background.jpg")', // 배경 이미지 설정
        backgroundRepeat: "no-repeat", // 배경 이미지 반복 방지
        backgroundPosition: "center", // 중앙 정렬
        backgroundSize: "cover",
      }}
      disableGutters
    >
      <Box
        sx={{
          width: "70%", // 반응형 너비 설정
          height: "60%", // 반응형 높이 설정
          backgroundColor: "#88AA8D",
          borderRadius: "8px", // 모서리 둥글게
          boxShadow: 3, // 그림자 효과
          alignItems: "center",
          justifyContent: "center",
          padding: 2, // 내부 여백
          display: "flex", // Flexbox 사용
          flexDirection: "column", // 세로 방향으로 정렬
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={7}>
            <Card variant="contained" sx={{ backgroundColor: "inherit", color: "white" }}>
              <CardContent>
                <Typography
                  sx={{ color: "white", marginBottom: 1, textAlign: "center", width: "90%", fontSize: "2.0rem" }}
                >
                  돌아오신 것을 너무 환영해요!
                </Typography>
                {exceptionMsg !== "" && (
                  <Typography
                    sx={{ color: "orange", marginBottom: 1, textAlign: "center", width: "90%", fontSize: "1.2rem" }}
                  >
                    {exceptionMsg}
                  </Typography>
                )}
                <Typography
                  sx={{
                    color: isEmailInvalid ? "orange" : "white",
                    marginBottom: 1,
                    textAlign: "left",
                    width: "90%",
                    fontSize: "0.8rem",
                  }}
                >
                  {isEmailInvalid ? "이메일 - 입력하신 이메일이 유효하지 않습니다." : "이메일"}
                </Typography>
                <TextField
                  value={email}
                  onChange={handleEmailInput}
                  fullWidth
                  sx={{
                    marginBottom: 1,
                    color: "green",
                    backgroundColor: "#E7EEE8",
                    width: "90%",
                    height: "40px", // 원하는 높이 설정
                    "& .MuiOutlinedInput-root": {
                      height: "40px", // 내부 입력 필드 높이 설정
                    },
                    "& .MuiInputBase-input": {
                      color: "black",
                    },
                  }} // 아래 여백
                  InputProps={{
                    sx: {
                      color: "white", // 입력 글자 색상 지정
                    },
                  }}
                />
                <Typography
                  sx={{
                    color: isPasswordInvalid ? "orange" : "white",
                    marginBottom: 1,
                    textAlign: "left",
                    width: "90%",
                    fontSize: "0.8rem",
                  }}
                >
                  {isPasswordInvalid ? "비밀번호 - 입력하신 비밀번호가 유효하지 않습니다." : "비밀번호"}
                </Typography>
                <TextField
                  value={password}
                  onChange={handlePasswordInput}
                  fullWidth
                  type="password"
                  sx={{
                    marginBottom: 1,
                    color: "white",
                    backgroundColor: "#E7EEE8",
                    width: "90%",
                    height: "40px", // 원하는 높이 설정
                    "& .MuiOutlinedInput-root": {
                      height: "40px", // 내부 입력 필드 높이 설정
                    },
                    "& .MuiInputBase-input": {
                      color: "black",
                    },
                  }} // 아래 여백
                  InputProps={{
                    sx: {
                      color: "white", // 입력 글자 색상 지정
                    },
                  }}
                />
                <Typography
                  sx={{ color: "white", marginBottom: 1, textAlign: "left", width: "90%", fontSize: "0.8rem" }}
                >
                  비밀번호를 잊으셨나요?{" "}
                  <Link style={{ color: "skyblue" }} onClick={onClickFindPassword}>
                    비밀번호 찾기
                  </Link>
                </Typography>
                <Button
                  onClick={onClickLoginButton}
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 2, height: "64px", width: "90%", fontSize: "1.2rem" }}
                >
                  로그인
                </Button>
                <Typography sx={{ color: "white", marginTop: 2, textAlign: "left", width: "90%", fontSize: "0.8rem" }}>
                  계정이 필요한가요?{" "}
                  <Link style={{ color: "skyblue" }} to="/register">
                    가입하기
                  </Link>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Card
              variant="contained"
              sx={{
                backgroundColor: "inherit",
                height: "100%",
                justifyContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent
                sx={{
                  display: "flex", // 추가
                  justifyContent: "center", // 추가
                  alignItems: "center", // 추가 (수직 중앙 정렬)
                }}
              >
                <Typography
                  sx={{ color: "white", marginBottom: 1, textAlign: "center", width: "90%", fontSize: "1.6rem" }}
                >
                  간편하게 로그인하기
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CardMedia
                  component="img"
                  height="180"
                  width="70"
                  sx={{
                    cursor: "pointer",
                    margin: 1,
                    objectFit: "cover",
                  }}
                  image="images/naver_login.png"
                  alt="naver login"
                  onClick={() => {
                    window.location.href = "http://localhost:8080/oauth2/authorization/naver";
                  }}
                />
                <CardMedia
                  component="img"
                  height="180"
                  width="70"
                  sx={{
                    cursor: "pointer",
                    margin: 1,
                    objectFit: "cover",
                  }}
                  image="images/google_login.jpg"
                  alt="google login"
                  onClick={() => {
                    window.location.href = "http://localhost:8080/oauth2/authorization/google";
                  }}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default LoginForm;
