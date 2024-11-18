import { useState } from 'react';
import { Modal, Box, Typography, Button, TextField, IconButton, Input } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { notifySuccess } from '../../common/NotificationToast'; // 알림 함수 임포트
import { reportUser } from '../../../api/userFeature/userFeatureApi';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // yyyy-mm-dd 형식
};

const CreateReport = ({ open, handleClose, reportedUserId }) => {
  const [reportReason, setReportReason] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!reportedUserId) {
        console.error('신고할 사용자 ID가 없습니다.');
        return;
    }

    const formData = new FormData();
    formData.append('reportReason', reportReason);
    if (file) formData.append('file', file);
  
    try {
      const response = await reportUser(reportedUserId, formData);
      if (response.ok) { // 성공적인 응답인지 확인
        notifySuccess('신고 요청이 완료되었습니다.');
        handleClose(); // 모달 닫기
      }
    } catch (error) {
      console.error('신고 제출 오류:', error);
    }
  };
  
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 500 }, // 모바일에서는 90%, 그 외에는 500px
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: 'light',
              color: '#B3B3B3',
              textAlign: 'right',
              mb: '4px',
              ml: '2px',
            }}
          >
            {formatDate(new Date())}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 'bold',
              color: '#5A5A5B',
            }}
          >
            신고 대상: {reportedUserId}
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="신고 사유"
          multiline
          rows={4}
          variant="outlined"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          InputProps={{
            sx: {
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#B3B3B3 !important', // 기본 테두리 색상
                },
                '&:hover fieldset': {
                  borderColor: '#6B8E23 !important', // 호버 상태 테두리 색상
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#6B8E23 !important', // 포커스 상태 테두리 색상
                },
              },
            },
          }}
          sx={{ mt: 2, mb: 2 }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label htmlFor="upload-file">
            <Input
              id="upload-file"
              type="file"
              onChange={handleFileChange}
              sx={{ display: 'none' }}
            />
            <IconButton
              color="primary"
              component="span"
              sx={{ mb: 2 }}
            >
              <PhotoCamera />
            </IconButton>
            <Typography
              variant="body2"
              sx={{ mb: 2 }}
            >
              파일 업로드
            </Typography>
          </label>
          {filePreview && (
            <img
              src={filePreview}
              alt="Preview"
              style={{ 
                maxWidth: '100%', 
                height: 'auto', 
                borderRadius: '8px', 
                marginBottom: '16px', 
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
              }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#6B8E23',
              ':hover': {
                backgroundColor: '#B3B3B3',
              },
              px: 2
            }}
          >
            제출
          </Button>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderColor: '#6B8E23',
              color: '#6B8E23',
              ':hover': {
                borderColor: '#B3B3B3',
                color: '#B3B3B3',
              },
              px: 2
            }}
          >
            닫기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateReport;
