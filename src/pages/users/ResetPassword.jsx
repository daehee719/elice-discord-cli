import { Container, Typography, Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { httpClient } from "../../api/httpClient";
import { changePassword } from "../../api/user/userApi";
import { Password } from "@mui/icons-material";

const ResetPassword = () => {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [firstPassword, setFirstPassword] = useState("");
    const [secondPassword, setSecondPassword] = useState("");

    const [isValidPasswordPair, setIsValidPasswordPair] = useState(true);

    const {userId} = localStorage.getItem("userInfo")

    // 비밀번호 변경 버튼 클릭 시 실행되는 함수
    const handleChangePassword = async (event) => {
        event.preventDefault()

        // 새 비밀번호와 비밀번호 재입력 내용이 일치하는 지 확인
        if(firstPassword.toString() !== secondPassword.toString()) {
            setFirstPassword("")
            setSecondPassword("")
            setIsValidPasswordPair(false)
            return
        }

        const passwordChangeForm = {
            "password" : firstPassword,
        }
        
        try {
            const response = await changePassword(passwordChangeForm)
            console.log(response)

            // 모달 띄우기
            setIsModalOpen(true)
        } catch (error) {
            console.log(error)
        }

        
    }

    const handleClose = () => {
        setIsModalOpen(false)
        navigate("/login")
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
                    새로 설정할 비밀번호를 입력해 주세요
                </Typography>
                <Typography sx={{color: isValidPasswordPair? 'white' : 'orange', marginBottom: 1, textAlign: 'left', width: '90%', fontSize: '0.8rem'}}>
                    {isValidPasswordPair ? '새로 설정할 비밀번호'
                        : '새로 설정할 비밀번호 - 비밀번호와 재입력 비밀번호가 일치하지 않아요'}
                </Typography>
                <TextField
                    type="password"
                    value={firstPassword}
                    onChange={(event) => {setFirstPassword(event.target.value)}}
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
                <Typography sx={{color: isValidPasswordPair? 'white' : 'orange', marginBottom: 1, textAlign: 'left', width: '90%', fontSize: '0.8rem'}}>
                    {isValidPasswordPair ? '새로 설정할 비밀번호 재입력'
                        : '새로 설정할 비밀번호 재입력 - 비밀번호와 재입력 비밀번호가 일치하지 않아요'}
                </Typography>
                <TextField
                    type="password"
                    fullWidth
                    value={secondPassword}
                    onChange={(event) => {setSecondPassword(event.target.value)}}
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
                <Button onClick={handleChangePassword} variant='contained' sx={{backgroundColor: "red", marginBottom: 1, width: "60%"}}>비밀번호 변경</Button>
            </Box>

            <Dialog open={isModalOpen} onClose={handleClose}>
                <DialogTitle>비밀번호 변경 완료</DialogTitle>
                <DialogContent>
                    <Typography>
                        비밀번호 변경이 완료되었습니다. 다시 로그인을 해주세요!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>

        </Container>
    )
}

export default ResetPassword;