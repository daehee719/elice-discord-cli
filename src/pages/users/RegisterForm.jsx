import { Container, Typography, Box, TextField, Button, FormControlLabel, Checkbox, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register, sendVerificationCode, checkVerificationCode } from "../../api/user/userApi";
import { checkEmail, checkNickname } from "../../api/user/userApi";
import { DialogActions } from "@mui/material";

const RegisterForm = () => {
    
    const navigate = useNavigate();

    // 이메일 중복체크 후, 이메일 중복 여부를 상태로 나타냄
    const [isEmailDuplicated, setIsEmailDuplicated] = useState('init');

    // 닉네임 중복체크 후, 닉네임 중복 여부를 상태로 나타냄
    const [isNicknameDuplicated, setIsNicknameDuplicated] = useState('init');

    // 이메일 인증하기 버튼 클릭 후, 이메일 인증 상자 표시하기
    const [isEmailCheckModalOpen, setIsEmailCheckModalOpen] = useState(false);

    // 회원가입 시 예외 메시지
    const [exceptionMsg, setExceptionMsg] = useState('');
    const [exceptionMsgModalOpen, setExceptionMsgModalOpen] = useState(false)

    // 인증번호
    const [checkNumber, setCheckNumber] = useState('')
    const [checkNumberPlaceHolder, setCheckNumberPlaceholder] = useState('인증번호 입력')

    const [isPasswordValid, setIsPasswordValid] = useState(true)

    // 이메일 인증하기 버튼을 눌렀을 때 동작하는 메소드
    const handleClickEmailVerification = async () => {
        // 해당 이메일로 인증 코드 보내기
        const data = {
            email
        }

        try {
            sendVerificationCode(data)
            .then(response => {
                console.log("인증번호 전송 성공")
            })
            .catch(error => {
                console.log("전송 실패");
                console.log(error);
            });

            // 이메일 인증 입력 창 활성화
            setIsEmailCheckModalOpen(true)
            setCheckNumberPlaceholder('인증번호 입력')
            return response
        } catch(error) {
            // 입력한 이메일이 유효하지 않을 경우
            if( error.response.data ) {
                setExceptionMsg(error.response.data)
                setExceptionMsgModalOpen(true)

            }   
        }
    }

    // 인증번호 제출을 눌렀을 때 동작하는 함수
    // 확인 코드를 입력하고 인증 하기 버튼을 눌렀을 때 동작하는 메소드
    const handleConfirmCheckingCode = async () => {

        checkVerificationCode(email, checkNumber)
        .then(response => {
            console.log("check")
        })
        .catch(error => {
            if(error.response.data.code === "U006") {
                setCheckNumber('')
                setCheckNumberPlaceholder("인증 실패")
            }
            return
        })

        setCheckNumber('')
        setCheckNumberPlaceholder("인증 성공")
    
    }
    
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [passwordReEntered, setPasswordReEntered] = useState('');
    const [marketAgreed, setMarketAgreed] = useState(false);

    // 마케팅 수신 동의 박스 체크 시 실행되는 함수
    const handleCheck = (event) => {
        setMarketAgreed(!marketAgreed)
    }

    // 회원가입 버튼 클릭 시 실행되는 함수
    const onRegister = async (event) => {

        // 비밀번호 입력과 재입력의 내용이 다를 경우 오류 modal 띄우기
        if(password !== passwordReEntered) {
            setIsPasswordValid(false)
            setPassword('')
            setPasswordReEntered('')
            return;
        }

        event.preventDefault()
        
        const registerForm = {
            email,
            nickname,
            password,
            marketAgreed
        }

        try {
            const response = await register(registerForm)
            
            console.log(response)

            if(response.data.success) {
                navigate("/registerComplete")
            }
        } catch (error) {
            console.log(error)
            if(error.response.data.message) {
                // 회원가입 애플리케이션 로직에 따른 예외의 경우
                setExceptionMsg(error.response.data.message)
            } else {
                // 입력값 검증에 의한 예외의 경우
                setExceptionMsg(error.response.data)
            }
            setExceptionMsgModalOpen(true)
        }

    }

    // 입력한 이메일에 해당하는 사용자가 있는 지 여부 체크
    const checkEmailIsDuplicated = async () => {
        const data = {
            email
        }

        try {
            const response = await checkEmail(data)
            
            // 이메일 중복이 있다면
            setIsEmailDuplicated('YES')
        } catch (error) {
            // 이메일 중복이 없다면
            console.log(error)
            if(error.response.data.code === "U003") {
                setIsEmailDuplicated('NO')
            }
        } 
    }

    // 입력한 닉네임에 해당하는 사용자가 있는 지 여부 체크
    const checkNicknameIsDuplicated = async () => {
        
        const data = {
            nickname
        }

        try {
            const response = await checkNickname(data)
            
            // 이메일 중복이 있다면
            setIsNicknameDuplicated('YES')
            console.log(isNicknameDuplicated)
            console.log(response)
        } catch (error) {
            // 이메일 중복이 없다면
            
            if(error.response.data.code === "U003") {
                setIsNicknameDuplicated('NO')
                console.log(isNicknameDuplicated)
            }
        } 
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
                    width: '40%', // 반응형 너비 설정
                    height: '100%', // 반응형 높이 설정
                    backgroundColor: '#88AA8D',
                    borderRadius: '8px', // 모서리 둥글게
                    boxShadow: 3, // 그림자 효과
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    padding: 2, // 내부 여백
                }}>
         
                <Typography sx={{color: 'white', marginBottom: 2, fontSize: '1.6rem'}}>
                    계정 만들기
                </Typography>
                <Typography sx={{color: 'white', marginBottom: 1, textAlign: 'left', width: '90%', fontSize: '0.8rem'}}>
                    이메일
                </Typography>
                
                <TextField
                    fullWidth
                    value={email}
                    onChange={(event) => {setEmail(event.target.value)}}
                    sx={{ 
                        marginBottom: 1, 
                        color: "white", 
                        backgroundColor: "#E7EEE8",
                        width: "90%",
                        height: '40px', // 원하는 높이 설정
                        '& .MuiOutlinedInput-root': {
                            height: '40px', // 내부 입력 필드 높이 설정
                        },
                        '& .MuiInputBase-input': {
                            color: "black"
                        }
                    }}  // 아래 여백
                    InputProps={{
                        sx: {
                            color: 'white', // 입력 글자 색상 지정
                        },
                    }}
                />
                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-start', width: '100%' }}>
                    <Button onClick={checkEmailIsDuplicated} variant="contained" sx={{ marginBottom: 1, marginTop: 0, marginLeft: 3, }}>
                        이메일 중복 체크
                    </Button>
                    {
                        isEmailDuplicated === 'NO' && (
                            <Typography sx={{ color: 'skyblue', marginLeft: 1, marginTop: 1, textAlign: 'left', fontSize: '0.8rem' }}>
                                사용가능한 이메일입니다.
                            </Typography>
                        )
                    }
                    {
                        isEmailDuplicated === 'YES' && (
                            <Typography sx={{ color: 'orange', marginLeft: 1, marginTop: 1, textAlign: 'left', fontSize: '0.8rem' }}>
                                이미 다른 사용자가 사용중인 메일입니다.
                            </Typography>
                        )
                    }
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'flex-start', width: '100%' }}>
                    <Button onClick={handleClickEmailVerification} variant="contained" sx={{marginBottom: 1, marginTop: 0, marginLeft: 3, alignSelf: 'flex-start',}}>이메일 인증 하기</Button>
                    {isEmailCheckModalOpen && (
                        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
                            <TextField
                                fullWidth
                                value={checkNumber}
                                onChange={(event) => {setCheckNumber(event.target.value)}}
                                placeholder= {checkNumberPlaceHolder}
                                sx={{ 
                                    marginBottom: 1, 
                                    color: "white",
                                    
                                    backgroundColor: "#E7EEE8",
                                    height: '40px', // 원하는 높이 설정
                                    '& .MuiOutlinedInput-root': {
                                        height: '40px', // 내부 입력 필드 높이 설정
                                    },
                                    '& .MuiInputBase-input': {
                                        color: "black"
                                    }
                                }}  // 아래 여백
                                InputProps={{
                                    sx: {
                                        color: 'white', // 입력 글자 색상 지정
                                        fontSize: '1.2rem'
                                    },
                                }}
                            />
                            <Button onClick={handleConfirmCheckingCode} variant="contained" sx={{marginBottom:1, marginLeft:2,}}>인증</Button>
                        </Box>
                    )}
                </Box>
                
                
                <Typography sx={{color: 'white', marginBottom: 1, textAlign: 'left', width: '90%', fontSize: '0.8rem'}}>
                    별명
                </Typography>
                <TextField
                    fullWidth
                    value={nickname}
                    onChange={(event) => {setNickname(event.target.value)}}
                    sx={{ 
                        marginBottom: 1, 
                        color: "white",
                        width: "90%",
                        backgroundColor: "#E7EEE8",
                        height: '40px', // 원하는 높이 설정
                        '& .MuiOutlinedInput-root': {
                            height: '40px', // 내부 입력 필드 높이 설정
                        },
                        '& .MuiInputBase-input': {
                            color: "black"
                        }
                    }}  // 아래 여백
                    InputProps={{
                        sx: {
                            color: 'white', // 입력 글자 색상 지정
                        },
                    }}
                />
                <Button onClick={checkNicknameIsDuplicated} variant="contained" sx={{marginBottom: 3, marginTop: 0, marginLeft: 3, alignSelf: 'flex-start',}}>별명 중복 체크</Button>
                {
                    isNicknameDuplicated === 'NO' && (
                        <Typography sx={{color: 'skyblue', marginBottom: 1, textAlign: 'left', width: '90%', fontSize: '0.8rem'}}>
                            사용가능한 닉네임입니다.
                        </Typography>
                    )
                }
                {
                    isNicknameDuplicated === 'YES' && (
                        <Typography sx={{color: 'orange', marginBottom: 1, textAlign: 'left', width: '90%', fontSize: '0.8rem'}}>
                            이미 다른 사용자가 사용중인 닉네임입니다.
                        </Typography>
                    )
                }
                
                <Typography sx={{color: isPasswordValid ? 'white' : 'orange', marginBottom: 1, textAlign: 'left', width: '90%', fontSize: '0.8rem'}}>
                    {isPasswordValid ? "패스워드 입력 / 재입력" : "패스워드 입력 / 재입력 - 두 입력란의 내용이 달라요"}
                    
                </Typography>
                <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 5}}>
                    <TextField
                        type="password"
                        value = {password}
                        onChange={(event) => {setPassword(event.target.value)}}
                        fullWidth
                        sx={{ 
                            marginBottom: 1, 
                            color: "white", 
                            width: "90%",
                            backgroundColor: "#E7EEE8",
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

                    <TextField
                        type="password"
                        fullWidth
                        value = {passwordReEntered}
                        onChange={(event) => {setPasswordReEntered(event.target.value)}}
                        sx={{ 
                            marginBottom: 1, 
                            color: "white", 
                            width: "90%",
                            backgroundColor: "#E7EEE8",
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
                </Box>
                    
            
                

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={marketAgreed}
                            onChange={handleCheck}
                            color="primary" // 체크박스 색상 설정
                        />
                    }
                label="(선택사항) 동의하시면 소식, 도움말, 특별할인을 이메일로 보내줘요.  언제든지 취소하실 수 있어요." // 체크박스 옆에 표시될 라벨
                sx={{ color: 'white', marginTop: 1, width: "90%"}}
                />
                <Button onClick={onRegister} variant="contained" color="primary" fullWidth sx={{marginTop: 2, height: "64px", width: "90%", fontSize: '1.2rem',}}>
                    계속하기
                </Button>
                <Typography sx={{color: 'white', marginBottom: 1, textAlign: 'left', width: '90%', fontSize: '0.8rem', marginTop: 1}}>
                    이 서비스는 <span style={{ color: 'skyblue' }}>서비스 이용 약관</span>과{' '}
                    <span style={{ color: 'skyblue' }}>개인정보 보호정책</span>에 따라 운영됩니다.
                </Typography>
                <Typography sx={{color: 'yellow', marginBottom: 1, textAlign: 'left', width: '90%', fontSize: '0.8rem', marginTop: 1}}>
                    <Link style={{color: "inherit"}} to="/login">이미 계정이 있으신가요?</Link>
                </Typography>
            </Box>

            {/* 예외 메시지 모달 */}
            <Dialog open={exceptionMsgModalOpen} onClose={() => {setExceptionMsgModalOpen(false)}}>
                <DialogTitle>오류</DialogTitle>
                <DialogContent>
                    <Typography>
                        {exceptionMsg}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => {setExceptionMsgModalOpen(false)}} color="primary">
                        확인
                    </Button>
                    

                </DialogActions>
            </Dialog>

        </Container>
        )
}

export default RegisterForm;