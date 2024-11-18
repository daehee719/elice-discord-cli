import React, { useState, useRef } from 'react';
import { Container, Typography, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Avatar } from "@mui/material";
import { changeProfileImage, checkPassword, deactivateUser, deleteUser } from '../../api/user/userApi';
import { useNavigate } from 'react-router-dom';
import { AccountCircleOutlined } from '@mui/icons-material';

const MyPage = () => {
    

    // 계정 설정과 프로필 세팅 중 어느 쪽이 활성화 되어 있는가
    // 계정 설정이 활성화 되어 있다면 계정 설정 관련 메뉴가,
    // 프로필 설정이 활성화 되어 있다면 프로필 설정 관련 메뉴가 오른쪽에 등장한다.
    const [accountSetting, setAccountSetting] = useState(true)
    const [profileSetting, setProfileSetting] = useState(false)
    const [profileImage, setProfileImage] = useState(JSON.parse(localStorage.getItem("userInfo"))['profileImage'])

    // 이미지 업로드 시, 이미지 미리보기 기능 구현시 사용되는 상태
    const [imagePreview, setImagePreview] = useState(null);
    // 업로드된 이미지 파일을 나타내는 상태
    const [imageFile, setImageFile] = useState(null);

    // 파일 입력 인풋을 클릭할 수 있도록 하기 위한 참조
    const fileInputRef = useRef(null);

    // 파일 업로드 버튼을 클릭하였을 때 동작하는 함수
    const handleFileUploadButtonClick = () => {
        fileInputRef.current.click();
    }

    // 파일이 업로드 될 때마다 실행되는 함수
    const handleFileChange = (e) => {
        // 업로드 된 파일 선택
        const file = e.target.files[0];

        if (file) {
          const reader = new FileReader();
    
          reader.onloadend = () => {
            setImagePreview(reader.result); // 미리보기 이미지 설정
            console.log(reader.result)
          };
          reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
          setImageFile(file);
          setProfileImage('nil')
        }

    };

    // 프로필 변경사항 저장을 클릭하여 실행되는 함수
    const handleProfileImageUpload = async () => {
        if(!imageFile) {
            console.log("업로드할 프로필 이미지가 존재하지 않습니다")
        }

        const formData = new FormData();
        formData.append('profileImage', imageFile);

        try {
            const response = await changeProfileImage(formData)

            alert("프로필 이미지가 성공적으로 변경되었습니다.")
            setIsProfileUpdateConfirmModalOpen(false)
            
            const userInfo = JSON.parse(localStorage.getItem("userInfo"))
            userInfo.profileImage = response.data

            localStorage.setItem("userInfo", JSON.stringify(userInfo))

            navigate("/")
        } catch (error) {
            console.error('업로드 중 오류 발생:', error);
            alert('업로드 중 오류가 발생했습니다.');
        }
    }

    const onClickAccountSetting = () => {
        setProfileSetting(false)
        setAccountSetting(true)
    }

    const onClickProfileSetting = () => {
        setAccountSetting(false)
        setProfileSetting(true)
    }

    const navigate = useNavigate()

    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    const {email, nickname} = userInfo

    const [isPasswordCheckModalOpen, setIsPasswordCheckModalOpen] = useState(false)
    const [password, setPassword] = useState('')
    const [nextUrl, setNextUrl] = useState('')

    // 지금 하려는 작업이 계정 비활성화 작업인가 여부
    const [deactive, setDeactive] = useState(false)
    // 계정 비활성화 작업용 모달 
    const [deactiveAccountModal, setDeactiveAccountModal] = useState(false)
    // 계정 비활성화 성공 모달
    const [deactivateSuccessfulModal, setDeactivateSuccessfulModal] = useState(false)

    // 지금 하려는 작업이 계정 삭제 작업인가 여부
    const [deleted, setDeleted] = useState(false)
    // 계정 삭제 작업용 모달 
    const [deleteAccountModal, setDeleteAccountModal] = useState(false)
    // 계정 삭제 성공 모달
    const [deleteSuccessfulModal, setDeleteSuccessfulModal] = useState(false)

    // 프로필 이미지 변경 확인 모달
    const [isProfileUpdateConfirmModalOpen, setIsProfileUpdateConfirmModalOpen] = useState(false)

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)


    const logout = () => {
        localStorage.clear()
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('refreshToken');

        navigate("/login")
    }

    // 수정하기 버튼을 클릭 시 나오는 비밀번호 체크 모달
    const handleClick = () => {
        setIsPasswordCheckModalOpen(true)
    }

    // 비밀번호 체크 모달을 닫았을 때 동작하는 함수
    const handleClose = () => {
        setIsPasswordCheckModalOpen(false)
        setPassword('')
    }

    // 비밀번호 체크 후 계정 비활성화 작업을 진행하는 함수
    const handleDeactivateAccount = async () => {
        setDeactiveAccountModal(false)

        try {
            const response = await deactivateUser()
            setDeactivateSuccessfulModal(true)
        } catch (error) {
            console.log(error)
        }
    }

    // 비밀번호 체크 후 계정 삭제작업을 진행하는 함수
    const handleDeleteAccount = async () => {
        setDeleteAccountModal(false)

        try {
            const response = await deleteUser()
            setDeleteSuccessfulModal(true)
        } catch (error) {
            console.log(error)
        }
    }

    // 비밀번호 제출 시 해당 비밀번호가 맞는 지 검증하는 과정
    const handleSubmit = async () => {
        // 비밀번호가 맞는 지 체크한다.
        const data = {
            password
        }

        try {
            const response = await checkPassword(data)

            // 비밀번호가 맞다면 그대로 진행
            setIsPasswordCheckModalOpen(false);

            // 만약 비활성화 작업이라면
            if(deactive) {
                setDeactiveAccountModal(true)
            // 만약 계정 삭제 작업이라면
            } else if (deleted) {
                console.log("sdf")
                setDeleteAccountModal(true)
            }
            else {
                navigate(nextUrl);
            }

            
        } catch(error) {
            // 비밀번호가 틀리다면 경고창을 띄우고 이전 페이지로
            console.log(error)
            if(error.response.data.code === 'U007') {
                alert("비밀번호가 올바르지 않습니다")
                setIsPasswordCheckModalOpen(false)
                setPassword('')
            }
            return;
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
                    width: '80%',
                    height: '80%',
                    backgroundColor: '#88aa8d',
                    borderRadius: '8px',
                    boxShadow: 3,
                    display: 'flex',
                    padding: 0,
                }}
                >
                <Box
                    sx={{
                        width: '25%', // 왼쪽 4분의 1
                        backgroundColor: '#88aa8d', // 구획의 배경색
                        borderRadius: '8px 0 0 8px', // 모서리 둥글게
                    }}
                >
                    <Box 
                        sx={{
                            backgroundColor: 'inherit', // 구획의 배경색
                            borderRadius: '8px 0 0 8px', // 모서리 둥글게
                            marginBottom: 10
                    }}>
                        <Typography sx={{fontSize: '1.6rem', marginTop: 3, textAlign: "center", color: 'white'}}> 
                            사 용 자 설 정
                        </Typography>

                    </Box>
                    <Box 
                        sx={{
                            backgroundColor: 'inherit', // 구획의 배경색
                            borderRadius: '8px 0 0 8px', // 모서리 둥글게
                            marginTop: 20
                    }}>
                        <Typography onClick = {onClickAccountSetting} sx={{fontWeight: accountSetting ? "bold" : "normal",  fontSize: '1.6rem', marginTop: 3, textAlign: "center", color: "white", cursor: 'pointer'}}> 
                            계정 설정
                        </Typography>
                        <Typography onClick = {onClickProfileSetting} sx={{fontWeight: profileSetting ? "bold" : "normal", fontSize: '1.6rem', marginTop: 3, textAlign: "center", color: "white", cursor: 'pointer'}}> 
                            프로필 설정
                        </Typography>
                        <Typography onClick = {() => setIsLogoutModalOpen(true)} sx={{fontWeight: "bold", fontSize: '1.6rem', marginTop: 15, textAlign: "center", color: 'white', cursor: 'pointer'}}> 
                            로그아웃
                        </Typography>

                    </Box>
                </Box>
                <Box
                    sx={{
                    width: '75%', // 오른쪽 나머지
                    backgroundColor: '#c2d6c6', // 구획의 배경색
                    borderRadius: '0 8px 8px 0', // 모서리 둥글게
                    }}
                >

                    {/* 계정 설정의 경우 */}

                    { accountSetting && (
                        <Box>
                            <Typography sx={{fontSize: '1.6rem', marginTop: 3, textAlign: "start", color: 'white', marginLeft: 5}}> 
                                내 계정
                            </Typography>
                            <Box 
                                sx={{
                                    backgroundColor: '#598b36', // 구획의 배경색
                                    borderRadius: '8px 0 0 8px', // 모서리 둥글게
                                    marginTop: 5,
                                    marginLeft: 5,
                                    marginRight: 5,
                                    padding: 0
                                }}>
                                <Box
                                    sx={{
                                        backgroundColor: '#e7ede8', // 구획의 배경색
                                        borderRadius: '8px 0 0 8px', // 모서리 둥글게
                                        padding: 2
                                    }}>
                                    <Typography sx={{color: '#5d8362', marginLeft: 2}}>
                                        이메일
                                    </Typography>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Typography sx={{color: '#5d8362', marginLeft: 2, textAlign: "start", fontWeight: "bold"}}>
                                            {email}
                                        </Typography>
                                    </Box>
                                    

                                    <Typography sx={{color: '#5d8362', marginLeft: 2, marginTop: 3}}>
                                        닉네임
                                    </Typography>
                                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <Typography sx={{color: '#5d8362', marginLeft: 2, textAlign: "start", fontWeight: "bold"}}>
                                            {nickname}
                                        </Typography>
                                        <Button onClick={() => {
                                            setNextUrl("/resetNickname")
                                            handleClick()
                                        }} variant='contained' sx={{ marginRight: 3, alignSelf: "flex-end", marginBottom: 2}}>수정 하기</Button>
                                    </Box>
                                </Box>
                            </Box>
                            <Typography sx={{fontSize: '1.6rem', marginTop: 2, textAlign: "start", color: 'white', marginLeft: 5}}> 
                                비밀번호와 인증
                            </Typography>
                            <Button onClick={() => {
                                setNextUrl("/resetPassword")
                                handleClick();
                            }} variant='contained' sx={{ marginTop: 1, marginRight: 3, alignSelf: "flex-end", marginBottom: 2, backgroundColor: "green", marginLeft: 5}}>비밀번호 변경</Button>
                            <Typography sx={{fontSize: '1.6rem', marginTop: 1, textAlign: "start", color: 'white', marginLeft: 5}}> 
                                계정 관리
                            </Typography>
                            <Button onClick={() => {
                                setDeactive(true);
                                handleClick();
                            }}
                            variant='contained' sx={{ marginTop: 1, marginRight: 3, alignSelf: "flex-end", marginBottom: 2, backgroundColor: "yellow", marginLeft: 5, color: "black"}}>계정 비활성화</Button>
                            <Button onClick={() => {
                                setDeleted(true);
                                handleClick();
                            }} variant='contained' sx={{ marginTop: 1, marginRight: 3, alignSelf: "flex-end", marginBottom: 2, backgroundColor: "red", marginLeft: 2}}>계 정 삭 제</Button>
                        
                        </Box>)}

                    {/* 프로필 설정의 경우 */}
                    {
                        profileSetting && (
                            <Box>
                                <Typography sx={{fontSize: '1.6rem', marginTop: 3, textAlign: "start", color: 'white', marginLeft: 5}}> 
                                    내 프로필
                                </Typography>
                                <Typography sx={{fontSize: '1.2rem', marginTop: 2, textAlign: "start", color: 'white', marginLeft: 5}}> 
                                    프로필 사진
                                </Typography>
                                <Box sx={{
                                    display : "flex",
                                    flexDirection: "column",
                                    alignItems : "center", // 수직 방향 중앙 정렬
                                    justifyContent : "center", // 수평 방향 중앙 정렬
                                    width: "50%"
                                }}>
                                    {(profileImage !== "nil") && (
    
                                        <>
                                            <Avatar 
                                                src={profileImage} 
                                                alt="미리보기" 
                                                sx={{ width: 200, height: 200, marginTop: 5, marginBottom: 3 }} // 아바타 크기 설정
                                            />
                                            <Typography sx={{fontSize: '1.2rem', fontWeight: "bold" ,marginBottom: 2,textAlign: "start", color: '#5d8362'}}> 
                                                친구에게 이런 모습으로 보여요!
                                            </Typography>
                                        </>
                                        
                                    )}
                                    { imagePreview && (
                                        <>
                                            <Avatar 
                                                src={imagePreview} 
                                                alt="미리보기" 
                                                sx={{ width: 200, height: 200, marginTop: 5, marginBottom: 3 }} // 아바타 크기 설정
                                            />
                                            <Typography sx={{fontSize: '1.2rem', fontWeight: "bold", marginBottom: 2,textAlign: "start", color: '#5d8362'}}> 
                                                친구에게 이런 모습으로 보여요!!
                                            </Typography>
                                        </>
                                        
                                    )}
                                    {(!imagePreview && profileImage === "nil") && (
                                        <>
                                            <AccountCircleOutlined sx={{fontSize: 200, marginTop: 5}}></AccountCircleOutlined>
                                            <Typography sx={{fontSize: '1.2rem', fontWeight: "bold", marginTop: 2, marginBottom: 2,textAlign: "start", color: '#5d8362'}}> 
                                                프로필 사진을 등록해 보세요
                                            </Typography>
                                        </>
                                       
                                    )}
                                    
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }} // 숨김 처리
                                    />
                                    <Button variant="contained" component="span" onClick={handleFileUploadButtonClick}>
                                        이미지 업로드
                                    </Button>

                                
                                </Box>

                                <Button variant="contained" component="span" onClick={() => {setIsProfileUpdateConfirmModalOpen(true)}} sx={{marginLeft: 5, marginTop: 4}}>
                                        변경사항 저장
                                </Button>

                
                            </Box>
                        )
                    }
                </Box>
            </Box>

            {/* 비밀번호 입력 모달 */}
            <Dialog open={isPasswordCheckModalOpen} onClose={handleClose}>
                <DialogTitle>비밀번호 입력</DialogTitle>
                    <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="비밀번호"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>취소</Button>
                    <Button onClick={handleSubmit}>확인</Button>
                </DialogActions>
            </Dialog>


            {/* 계정 비활성화 동의 모달*/}
            <Dialog open={deactiveAccountModal} onClose={() => {
                    setDeactiveAccountModal(false)
                    setDeactive(false)
                
                }}>
                <DialogTitle>계정 비활성화 동의</DialogTitle>
                <DialogContent>
                    <Typography>
                        계정을 비활성화 하시겠습니까?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeactivateAccount} color="primary">
                        확인
                    </Button>
                    <Button onClick={() => {
                        setDeactiveAccountModal(false)
                        setDeactive(false)
                        setPassword('')
                
                }} color="primary">
                        취소
                    </Button>

                </DialogActions>
            </Dialog>

            {/* 계정 비활성화 성공 모달 */}
            <Dialog open={deactivateSuccessfulModal} onClose={logout}>
                <DialogTitle>계정 비활성화 성공</DialogTitle>
                <DialogContent>
                    <Typography>
                        계정이 성공적으로 비활성화 되었어요
                        로그인 창으로 이동합니다.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => {
                        setDeactivateSuccessfulModal(false)
                        logout()
                    }
                    } color="primary">
                        확인
                    </Button>
                    

                </DialogActions>
            </Dialog>

            {/* 계정 삭제 동의 모달*/}
            <Dialog open={deleteAccountModal} onClose={() => {
                    setDeleteAccountModal(false)
                    setDeleted(false)
                
                }}>
                <DialogTitle>계정 삭제 동의</DialogTitle>
                <DialogContent>
                    <Typography>
                        계정을 삭제 하시겠습니까?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteAccount} color="primary">
                        확인
                    </Button>
                    <Button onClick={() => {
                        setDeleteAccountModal(false)
                        setDeleted(false)
                        setPassword('')
                
                }} color="primary">
                        취소
                    </Button>

                </DialogActions>
            </Dialog>

            {/* 계정 삭제 성공 모달 */}
            <Dialog open={deleteSuccessfulModal} onClose={logout}>
                <DialogTitle>계정 삭제 성공</DialogTitle>
                <DialogContent>
                    <Typography>
                        계정이 성공적으로 삭제 되었어요
                        그동안 우리 서비스를 만들어 주셔서 감사드립니다!
                        언제든지 돌아와 주세요!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ () => {
                        setDeleteSuccessfulModal(false)
                        logout()
                    }
                    } color="primary">
                        확인
                    </Button>
                    

                </DialogActions>
            </Dialog>

            {/* 프로필 변경 동의 모달*/}
            <Dialog open={isProfileUpdateConfirmModalOpen} onClose={() => {
                    setIsProfileUpdateConfirmModalOpen(false)
                }}>
                <DialogTitle>프로필 변경 동의</DialogTitle>
                <DialogContent>
                    <Typography>
                        프로필을 변경하시겠습니까?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleProfileImageUpload} color="primary">
                        확인
                    </Button>
                    <Button onClick={() => {
                       setIsProfileUpdateConfirmModalOpen(false)
                }} color="primary">
                        취소
                    </Button>

                </DialogActions>
            </Dialog>

            {/* 로그아웃 클릭 시 나오는 모달 */}
            <Dialog open={isLogoutModalOpen} onClose={() => {
                    setIsLogoutModalOpen(false)
                }}>
                <DialogTitle>로그아웃 동의</DialogTitle>
                <DialogContent>
                    <Typography>
                        로그아웃을 하시겠습니까?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={logout} color="primary">
                        확인
                    </Button>
                    <Button onClick={() => {
                       setIsLogoutModalOpen(false)
                }} color="primary">
                        취소
                    </Button>

                </DialogActions>
            </Dialog>

            

        </Container>
    )
}

export default MyPage;