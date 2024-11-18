import { Card, CardContent, Typography } from "@mui/material";
import BackHandIcon from '@mui/icons-material/BackHand';

const NotFoundPage = () => {
    return (
        <Card sx={{
            display: 'flex', // Flexbox 사용
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: 'column',
            backgroundColor: '#2c2c2c' // 옅은 검은색 배경
        }}>
            <CardContent sx={{
                display: 'flex', // Flexbox 사용
                alignItems: "center",
                justifyContent: "center",
                flexDirection: 'column',
            }}>
                <BackHandIcon sx={{
                    color: "white",
                    width: "300px",
                    height: "300px"}}>

                </BackHandIcon>
                <Typography variant="h2" sx={{
                    color: "white",
                    marginTop: 6
                }}>
                    404 Error
                </Typography>
                <Typography align="center" sx={{
                    color: "white",
                    marginTop: 4
                }}>
                    죄송합니다. 페이지를 찾을 수 없습니다.<br></br>
                    존재하지 않는 주소를 입력하셨거나,<br></br>
                    요청하신 주소가 변경, 삭제되어 찾을 수 없습니다.<br></br>
                </Typography>
            </CardContent>
        </Card>
    )
}

export default NotFoundPage;