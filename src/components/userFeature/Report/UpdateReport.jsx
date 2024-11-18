import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, Input } from '@mui/material';
import { editReport } from '../../../api/userFeature/userFeatureApi';
import { notifySuccess } from '../../common/NotificationToast';

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // yyyy-mm-dd 형식
};

const UpdateReport = ({ open, handleClose, report, onUpdate }) => {
  const [reportReason, setReportReason] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (report) { 
      setReportReason(report.reportReason || '');
      setImageUrl(`http://localhost:8080/reports/${report.id}/image`);
      if (report.reportImage) {
        setFilePreview(`data:image/jpeg;base64,${report.reportImage}`);
      }
    }
  }, [report]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  // 수정 필요
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('reportReason', reportReason);
    if (file) formData.append('file', file);

    try {
      const response = await editReport(report.id, formData);
      console.log('결과: ', response);
      if (response.status === 200) { // 성공적인 응답인지 확인
        onUpdate(); // 상위 컴포넌트에 업데이트 요청
        handleClose(); // 모달 닫기
      }
    } catch (error) {
      console.error("수정 실패:", error);
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
            mb: 4,
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
          onChange={(e) => setReportReason(e.target.value)}
          sx={{ mb: 2 }}
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
        <Input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          sx={{ 
            width: '500px',
            mb: 2,
            mr: 2
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            sx={{
              backgroundColor:'#6B8E23',
              ':hover': {
                backgroundColor:'#9097A0'
              }
            }}>
            수정 완료
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UpdateReport;
