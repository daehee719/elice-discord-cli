import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Box, Button, TextField } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import { checkVerificationCode, sendVerificationCode } from '../../api/user/userApi';

const FindPassword = () => {

    const navigate = useNavigate();

    // 이전 로그인 화면에서 사용자가 입력한 이메일
    const location = useLocation();
    const email = location.state?.email;

    // 확인코드 검증작업 성공 시
    // 잘못된 확인코드 입력 시
    // 코드 재전송 시 표시하는 메시지를 다루기 위한 변수 선언
    const [msgActivated, setMsgActivated] = useState(false)
    const [msg, setMsg] = useState('')

    const inputRefs = useRef([]);

    // 입력된 각 상태코드를 가리키는 배열
    const [inputValues, setInputValues] = useState(Array(6).fill(''));

    // 인증코드를 이메일로 보내는 메소드
    const sendVerificationCodeToEmail = async () => {
        const data = {
            email
        }
        try {
            const response = await sendVerificationCode(data);
            return response
        } catch(error) {
            console.log("전송 실패");
            console.log(error)
        }
    }

    const resendVerificationCode = async () => {
        sendVerificationCode(email)
            .then(response => {
                console.log("코드 전송 성공:", response);
            })
            .catch(error => {
                console.log("전송 실패");
                console.log(error);
            });

    
        setMsgActivated(true);
        setMsg("코드가 귀하의 이메일로 재 전송 되었습니다");
    }


    // 컴포넌트가 렌더링이 될 때에 딱 한번, 입력된 이메일로 확인코드 숫자 6자리를 보내도록 하기
    useEffect(() => {
        const sendCode = async () => {
            await sendVerificationCodeToEmail();
        };
    
        sendCode();
    }, []);


    // 확인코드 입력 시 동작하는 함수
    const handleChange = (index, event) => {
        const { value } = event.target;

        // 현재 입력한 값이 숫자일 경우
        if (value.length === 1 && !isNaN(value)) {
            // 값을 상태에 업데이트
            const newValues = [...inputValues];
            newValues[index] = value;
            setInputValues(newValues);

            // 다음 입력 칸으로 포커스 이동
            if (index < inputRefs.current.length - 1) {
                inputRefs.current[index + 1].focus();
            }
        } else if (value.length === 0 && index > 0) {
            // 현재 입력 칸이 비었고 이전 칸이 있는 경우
            const newValues = [...inputValues];
            newValues[index] = ''; // 이전 칸 비우기
            setInputValues(newValues);
            inputRefs.current[index - 1].focus();
        }
    };

    // 취소버튼을 눌렀을 때 로그인 페이지로 리다이렉션
    const handleCancle = () => {
        navigate("/login")
    }

    // 확인 코드를 입력하고 인증 하기 버튼을 눌렀을 때 동작하는 메소드
    const handleConfirmCheckingCode = async () => {
        // 확인코드를 실제로 확인하는 로직
        const code = inputValues.join('')

        checkVerificationCode(email, code)
        .then(response => {
            console.log("check")
        })
        .catch(error => {
            if(error.response.data.code === "U006") {
                setMsg("확인 코드가 일치하지 않습니다. 다시 한번 확인해 주세요.")
                setMsgActivated(true)
            }
        })

        setMsg("확인 코드가 성공적으로 검증되었고, 귀하의 이메일로 임시 비밀번호가 발송되었습니다. 다시 로그인 해 주세요")
        setMsgActivated(true)


        // try {
        //     const response = await checkVerificationCode(email, code)
        //     setMsg("확인 코드가 성공적으로 검증되었고, 귀하의 이메일로 임시 비밀번호가 발송되었습니다. 다시 로그인 해 주세요")
        //     setMsgActivated(true)
        // } catch (error) {
        //     if (error.response.data.code === "U006") {
        //         setMsg("확인 코드가 일치하지 않습니다. 다시 한번 확인해 주세요.")
        //         setMsgActivated(true)
        //     }
        // }
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
                    backgroundColor: '#88AA8D',
                    borderRadius: '8px', // 모서리 둥글게
                    boxShadow: 3, // 그림자 효과
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2, // 내부 여백
                }}>


                

                <Typography sx={{color: 'white', marginBottom: 1, fontSize: '1.2rem', alignItems: "center"}}>
                    입력하신 이메일로 전송된 확인 코드를 입력해 주세요
                </Typography>
                {msgActivated && (
                    <Typography sx={{color: 'orange', marginBottom: 1, fontSize: '0.8rem', alignItems: "center"}}>
                        {msg}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1, marginBottom: 2 }}>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <TextField
                            key={index}
                            inputRef={el => (inputRefs.current[index] = el)}
                            variant="outlined"
                            inputProps={{
                                maxLength: 1, // 숫자 한 자리만 입력 가능
                                style: { textAlign: 'center', width: '40px' }, // 스타일 조정
                            }}
                            onChange={event => handleChange(index, event)}
                            sx={{ backgroundColor: 'white' }}
                        />
                    ))}
                </Box>
                    <Button onClick={handleConfirmCheckingCode} variant='contained' color='primary' sx={{marginBottom: 1, width: "60%"}}>인증 하기</Button>
                    <Button onClick={handleCancle} variant='contained' sx={{backgroundColor: "red", marginBottom: 1, width: "60%"}}>로그인 하러 하기</Button>
                    <Button onClick={resendVerificationCode} variant='contained' sx={{backgroundColor: "green", width: "60%"}}>코드 재전송</Button>
            </Box>
        </Container>
    )
}

export default FindPassword;