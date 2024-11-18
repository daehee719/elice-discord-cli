import React from 'react';
import { Box, Typography, Avatar, IconButton, Paper, Tooltip, Popover } from '@mui/material';
import {
  Person as PersonIcon, MoreVert as MoreVertIcon
} from '@mui/icons-material';
import * as colors from "@mui/material/colors";



const ProfilePage = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

  return (
      <Box sx={{ bgcolor: colors.grey[400], minHeight: '100vh',  width: '350px', color: 'white' }}>
        {/* Header */}
        <Box sx={{ bgcolor: colors.grey[500], height: '200px', position: 'relative' }}>
          <Tooltip title="친구 추가" placement="top">
            <IconButton sx={{ position: 'absolute', width: "30px", height: "30px", top: "80px", right: "50px", color: 'white', bgcolor: colors.grey[400], "&:hover": { bgcolor: colors.grey[900] } }}>
              <PersonIcon sx={{ width: "20px", height: "20px"}}/>
            </IconButton>
          </Tooltip>
          <Tooltip title="기타" placement="top">
            <IconButton sx={{ position: 'absolute', width: "30px", height: "30px", top: "80px", right: "10px", color: 'white', bgcolor: colors.grey[400], "&:hover": { bgcolor: colors.grey[900] } }}>
              <MoreVertIcon onClick={handleClick} sx={{ width: "20px", height: "20px"}}/>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={{ top: 80, left: 1375 }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
            >
              <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
            </Popover>
          </Tooltip>
        </Box>

        {/* Profile Info */}
        <Box sx={{ px: 3, pb: 3, bgcolor: colors.grey[400]}}>
          <Avatar
              sx={{
                width: 80,
                height: 80,
                border: '6px solid #36393f',
                bgcolor: colors.grey[400],
                position: 'relative',
                top: -40,
                mb: -4
              }}
          >
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            유저 이름
          </Typography>
          <Typography variant="body2" sx={{ color: '#b9bbbe' }}>
            유저 ID
          </Typography>

          {/* Join Date */}
          <Paper sx={{ bgcolor: colors.grey[500], p: 2, mt: 2, borderRadius: 1 }}>
            <Typography variant="body2" sx={{ color: colors.grey[100], fontSize: "14px", mb: "10px" }}>
              가입 시기:
            </Typography>
            <Typography variant="body1" sx={{ color: colors.grey[100], fontSize: "14px" }}>
              2018년 1월 10일
            </Typography>
          </Paper>

          {/* Server and Friend Info */}
          <Paper sx={{ bgcolor: colors.grey[500], mt: 2, borderRadius: 1 }}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: colors.grey[100], fontSize: "14px" }}>
                같이 있는 서버 1개
              </Typography>
              <Typography sx={{ color: '#b9bbbe' }}>&gt;</Typography>
            </Box>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #40444b' }}>
              <Typography variant="body1" sx={{ color: colors.grey[100], fontSize: "14px" }}>
                같이 아는 친구 2명
              </Typography>
              <Typography sx={{ color: '#b9bbbe' }}>&gt;</Typography>
            </Box>
          </Paper>

          {/* View Full Profile Button */}
          <Box sx={{ mt: 2, bgcolor: colors.grey[400] }}>
            <Typography
                variant="body2"
                sx={{
                  color: colors.grey[700],
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
            >
              전체 프로필 보기
            </Typography>
          </Box>
        </Box>
      </Box>
  );
};

export default ProfilePage;