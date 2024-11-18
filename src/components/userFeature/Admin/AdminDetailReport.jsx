import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Button, TextField, Snackbar, Alert } from '@mui/material';
import { adminResponseReport } from '../../../api/userFeature/userFeatureApi';
import ConfirmationModal from '../../common/ConfirmationModal';

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // yyyy-mm-dd 형식
};

// AdminToast 컴포넌트 정의
const AdminToast = ({ open, message, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

const AdminDetailReport = ({ open, handleClose, report, onReportProcessed }) => {
  const [reportReason, setReportReason] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [filePreview, setFilePreview] = useState('');
  
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [responseStatus, setResponseStatus] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

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

  const handleResponse = async () => {
    try {
      await adminResponseReport(report.id, responseStatus);
      setToastOpen(true); 
      handleClose(); 
      if (onReportProcessed) {
        onReportProcessed(report.id); // 부모 컴포넌트에 신고 처리 완료 알림
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirm = (status) => {
    let message = '';
    let successMessage = '';
    switch (status) {
      case 'INSUFFICIENT_EVIDENCE':
        message = '기각 처리를 하시겠습니까?';
        successMessage = '기각 처리가 완료되었습니다';
        break;
      case 'INADEQUATE_REASON':
        message = '기각 처리를 하시겠습니까?';
        successMessage = '기각 처리가 완료되었습니다';
        break;
      case 'ACCEPTED':
        message = '경고 처리를 하시겠습니까?';
        successMessage = '경고 처리가 완료되었습니다';
        break;
      default:
        break;
    }
    setConfirmationMessage(message);
    setToastMessage(successMessage);
    setResponseStatus(status);
    setOpenConfirmDialog(true);
  };

  const handleConfirmClose = () => {
    setOpenConfirmDialog(false);
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <>
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
              flexDirection: 'column', // 수직 정렬
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
                  '&:hover fieldset': {
                    borderBlockColor: '#6B8E23 !important', // 호버 상태 테두리 색상
                  },
                  '&.Mui-focused fieldset': {
                    borderBlockColor: '#6B8E23 !important', // 포커스 상태 테두리 색상 - 적용 안 되고 있음
                  },
                },
              },
            }}
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
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleConfirm('INSUFFICIENT_EVIDENCE')}
              sx={{
                backgroundColor: '#B3B3B3',
                ':hover': {
                  backgroundColor: '#5A5A5B'
                },
                px: 2 
              }}
            >
              기각: 증거 불충분
            </Button>
            <Button
              variant="contained"
              onClick={() => handleConfirm('INADEQUATE_REASON')}
              sx={{
                backgroundColor: '#B3B3B3',
                ':hover': {
                  backgroundColor: '#5A5A5B'
                },
                px: 2 
              }}
            >
              기각: 부적절한 사유
            </Button>
            <Button
              variant="contained"
              onClick={() => handleConfirm('ACCEPTED')}
              sx={{
                backgroundColor: '#B3B3B3',
                ':hover': {
                  backgroundColor: 'darkRed'
                },
                px: 2 
              }}
            >
              경고 처리
            </Button>
          </Box>
        </Box>
      </Modal>

      <ConfirmationModal
        open={openConfirmDialog}
        onClose={handleConfirmClose}
        onConfirm={() => {
          handleResponse();
          handleConfirmClose();
        }}
        message={confirmationMessage} 
        title="응답 확인"
      />

      <AdminToast
        open={toastOpen}
        message={toastMessage}
        onClose={handleToastClose}
      />
    </>
  );
};

export default AdminDetailReport;
