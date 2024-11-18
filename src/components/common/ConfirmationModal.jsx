import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 24,
    p: 4,
};

const ConfirmationModal = ({ open, onClose, onConfirm, message, title }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    {title}
                </Typography>
                <Box sx={{ display: 'flex', mt: 3 }}>
                    <Typography id="modal-description">
                        {message}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'right', mt: 3 }}>
                    <Button onClick={onClose}>취소</Button>
                    <Button onClick={onConfirm} color="error">확인</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ConfirmationModal;