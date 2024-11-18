import { Container, Typography, Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeNickname } from "../../api/user/userApi";

const ResetNickname = () => {
    const navigate = useNavigate();

    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const logout = () => {
        localStorage.clear()
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('refreshToken');

        navigate("/login")
    }

    const [nickname, setNickname] = useState("");

    // 닉네임 변경 시 실행되는 함수
    const handleChangeNickname = async (event) => {
        event.preventDefault()

        const nicknameChangeForm = {
            "nickname" : nickname,
        }
        
        try {
            const response = await changeNickname(nicknameChangeForm)
            console.log(response)

            
        } catch (error) {
            console.log(error)
        }

        setIsSuccessModalOpen(true)
        
    }

    const handleClick = () => {
        setIsWarningModalOpen(true)
    }

    // 취소버튼을 눌렀을 경우
    const handleCancel = () => {
        setIsWarningModalOpen(false)
        navigate("/MyPage")
    }

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
                    backgroundColor: '#313338',
                    borderRadius: '8px', // 모서리 둥글게
                    boxShadow: 3, // 그림자 효과
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2, // 내부 여백
                }}>
                <Typography sx={{color: 'white', marginBottom: 4, textAlign: 'center', width: '90%', fontSize: '2.0rem'}}>
                    새로 설정할 닉네임을 입력해 주세요
                </Typography>
                <Typography sx={{color: 'white', marginBottom: 1, textAlign: 'left', width: '90%', fontSize: '0.8rem'}}>
                    닉네임
                </Typography>
                <TextField
                    value={nickname}
                    onChange={(event) => {setNickname(event.target.value)}}
                    fullWidth
                    sx={{ 
                        marginBottom: 1, 
                        color: "white", 
                        width: "90%",
                        backgroundColor: "#1e1f22",
                        height: '40px', // 원하는 높이 설정
                        '& .MuiOutlinedInput-root': {
                            height: '40px', // 내부 입력 필드 높이 설정
                        },
                    }}  // 아래 여백
                    InputProps={{
                        sx: {
                            color: 'white', // 입력 글자 색상 지정
                        },
                    }}
                />
               
                <Button onClick={handleClick} variant='contained' sx={{backgroundColor: "red", marginBottom: 1, width: "60%"}}>닉네임 변경</Button>
            </Box>

            <Dialog open={isWarningModalOpen} onClose={handleCancel}>
                <DialogTitle>닉네임 변경 동의</DialogTitle>
                <DialogContent>
                    <Typography>
                        닉네임을 정말 바꾸시겠습니까?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleChangeNickname} color="primary">
                        확인
                    </Button>
                    <Button onClick={() => {setIsWarningModalOpen(false)}} color="primary">
                        취소
                    </Button>

                </DialogActions>
            </Dialog>

            {/* 닉네임 변경 성공 시 나타나는 모달 */}
            <Dialog open={isSuccessModalOpen} onClose={logout}>
                <DialogTitle>닉네임 변경 성공</DialogTitle>
                <DialogContent>
                    <Typography>
                        닉네임이 성공적으로 변경되었어요.
                        정상적인 서비스 이용을 위해 다시 로그인을 부탁드려요!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={logout} color="primary">
                        확인
                    </Button>
                    

                </DialogActions>
            </Dialog>

        </Container>
    )
}

export default ResetNickname;