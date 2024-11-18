import { Container, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

const RegisterComplete = () => {

    return (
        <Container maxWidth="xl" sx={{
            display: 'flex', // Flexbox 사용
            width: '100%', // 부모 요소의 너비를 100% 차지
            height: '100vh', // 부모 요소의 높이를 100vh로 설정 (전체 화면 높이)
            alignItems: "center",
            justifyContent: "center",
            flexDirection: 'column',
            backgroundImage: 'url("images/user_background.jpg")', // 배경 이미지 설정
            backgroundRepeat: 'no-repeat', // 배경 이미지 반복 방지
            backgroundPosition: 'center', // 중앙 정렬
            backgroundSize: 'cover'
        }} disableGutters>
            <Box
                sx={{
                    width: '50%', // 반응형 너비 설정
                    height: '50%', // 반응형 높이 설정
                    backgroundColor: '#88AA8D',
                    borderRadius: '8px', // 모서리 둥글게
                    boxShadow: 3, // 그림자 효과
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2, // 내부 여백
                }}>
                <Typography sx={{color: 'white', marginBottom: 4, fontSize: '2.0rem'}}>
                    우리 가족이 되신 것을 환영합니다!
                </Typography>
                <Typography sx={{color: 'skyblue', marginBottom: 1, fontSize: '1.2rem', marginTop: 1}}>
                    <Link style={{color: "inherit"}} to="/login">로그인 하러 가기</Link>
                </Typography>
            </Box>
        </Container>
    )
}

export default RegisterComplete;