import { Box, Typography } from "@mui/material";

const MainFooter = () => {
    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                /*borderTop: '4px solid #26282A',*/
                padding: '5px 0px 10px 0px',
                bgcolor: '#C2D6C6',
                boxSizing: 'border-box', // box-sizing 설정으로 패딩 및 경계를 포함한 전체 너비를 맞춤
                textAlign: 'center',
            }}
        >
            <Typography
                sx={{
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: { xs: '10px', sm: '12px' },
                    mt: 1,
                    transition: 'color 0.3s ease, transform 0.3s ease',
                    "&:hover": {
                        transform: 'scale(1.05)',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                SPATZ
            </Typography>
            <Typography
                sx={{
                    color: '#FFFFFF',
                    fontSize: { xs: '8px', sm: '10px' },
                    transition: 'color 0.3s ease, transform 0.3s ease',
                    "&:hover": {
                        transform: 'scale(1.05)',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                이메일: spatz@elice.com 전화: 0000-0000
            </Typography>
            <Typography
                sx={{
                    color: '#FFFFFF',
                    fontSize: { xs: '8px', sm: '10px' },
                    mb: 2,
                    transition: 'color 0.3s ease, transform 0.3s ease',
                    "&:hover": {
                        transform: 'scale(1.05)',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                주소: 서울특별시 성동구 아차산로17길 성수낙낙
            </Typography>
        </Box>
    );
};

export default MainFooter;
