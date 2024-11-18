import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate } from 'react-router-dom';

const MainHeader = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                height: '80px',
                width: '100%',
                bgcolor: '#C2D6C6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            {/* 로고 */}
            <Typography
                sx={{
                    color: '#FFFFFF',
                    fontSize: '30px',
                    fontWeight: 'bold',
                    marginLeft: '30px',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                    transition: 'color 0.3s ease, transform 0.3s ease',
                    "&:hover": {
                        transform: 'scale(1.05)',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                    },
                    display: 'flex',
                    alignItems: 'center', 
                }}
            >
                SPATZ
            </Typography>

            {/* 오른쪽 아이콘들 */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* DM 탭 이동 아이콘 */}
                <Tooltip title='DM 페이지 이동'>
                    <IconButton
                        onClick={() => navigate('/dmPage')}
                        sx={{ color: '#FFFFFF', mr: 1, }}
                    >
                        <EmailIcon/>
                    </IconButton>
                </Tooltip>
                {/* 마이페이지 이동 아이콘 */}
                <Tooltip title='마이페이지 이동'>
                    <IconButton title='마이페이지 이동'
                        onClick={() => navigate('/myPage')}
                        sx={{ color: '#FFFFFF', mr: 2,}}
                    >
                        <SettingsIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default MainHeader;
