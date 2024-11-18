import { useEffect } from "react";
import { transferJWTTokenFromCookieToHeader } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const JWTTokenTransfer = () => {

    const navigate = useNavigate();

    useEffect(() => {

        const JWTCookieToHeader = async () => {
            try {
                const response = await transferJWTTokenFromCookieToHeader()
    
                // 로그인 후 처리 (예: 페이지 이동 등)
                if (response.status === 200) {
                    console.log('로그인 성공');
                    // 필요한 경우 추가 처리
                    const {accessToken, refreshToken} = response.data;
                    // Access + Refresh Token을 로컬 스토리지에 저장
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                    
                    
                    // JWT를 디코딩하여 정보 추출하고 로컬스토리지에 저장
                    const payload = jwtDecode(accessToken)
                    const {userId, nickname, email, role} = payload
                    const userInfo = {userId, nickname, email, role}
                    localStorage.setItem('userInfo', JSON.stringify(userInfo))

                    
                  }
            } catch (error) {
                console.log(error)
            }
        }

        JWTCookieToHeader();

        // 홈 페이지로 이동
        navigate('/');
    }, [])

    return (
        <>
            <h1></h1>
        </>
    )
}

export default JWTTokenTransfer;