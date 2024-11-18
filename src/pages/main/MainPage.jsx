import { Box, Typography } from "@mui/material";
import MainFooter from "../../components/main/MainFooter";
import MainHeader from "../../components/main/MainHeader";
import ImageSlider from "../../components/main/ImageSlider";

const MainPage = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const username = (userInfo === null ? 'GUEST' : userInfo.nickname);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh', // 전체 화면 높이
            }}
        >
            <MainHeader />
            <Box
                sx={{
                    flex: 1, // 가능한 모든 남은 공간을 차지
                    bgcolor: '#E7EEE8',
                    overflowY: 'auto', // 세로 스크롤 허용
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // 슬라이더를 중앙에 배치
                    justifyContent: 'center', // 슬라이더를 중앙에 배치
                    padding: 2,
                }}
            >
                {/* 환영 문구 */}
                <Box
                    sx={{
                        color: '#68796B',
                        padding: 3,
                        borderRadius: 2,
                        textAlign: 'center',
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            fontSize: 25,
                            fontWeight: 500,
                            mb: 5,
                            transform: 'scale(1.05)',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        사람과 세상을 향한 모든 연결의 시작, SPATZ
                    </Typography>
                    <ImageSlider />
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: 25,
                            fontWeight: 500,
                            mt: 5,
                            transition: 'color 0.3s ease, transform 0.3s ease',
                            "&:hover": {
                                transform: 'scale(1.05)',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                            },
                        }}
                    >
    {username}님, 환영합니다
</Typography>

                </Box>
            </Box>
            <MainFooter />
        </Box>
    );
};

export default MainPage;