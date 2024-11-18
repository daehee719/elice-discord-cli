import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // yyyy-mm-dd 형식
};

const DetailReport = ({ open, handleClose, report }) => {
  const [reportReason, setReportReason] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [filePreview, setFilePreview] = useState('');

  useEffect(() => {
    if (report) {
      setReportReason(report.reportReason || '');
      setImageUrl(`http://localhost:8080/reports/${report.id}/image`);
      if (report.reportImage) {
        // 미리보기 URL 설정
        setFilePreview(`data:image/jpeg;base64,${report.reportImage}`);
      }
    }
  }, [report]);

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
            {formatDate(report.createdAt)}
          </Typography>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 'bold',
              color: '#5A5A5B',
            }}
          >
            신고 대상: {report.reportedNickname}
          </Typography>
        </Box>
        <TextField
          fullWidth
          label="신고 사유"
          multiline
          rows={4}
          variant="outlined"
          value={reportReason}
          InputProps={{
            readOnly: true,
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
        {filePreview && (
          <img
            src={filePreview}
            alt="Preview"
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              borderRadius: '8px', 
              marginBottom: '16px', 
              marginTop: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
            }}
          />
        )}
        {imageUrl && !filePreview && (
          <img
            src={imageUrl}
            alt="Report"
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              borderRadius: '8px', 
              marginBottom: '16px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
            }}
          />
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{
              backgroundColor: '#6B8E23',
              ':hover': {
                backgroundColor: '#B3B3B3',
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

export default DetailReport;

