import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const StyledToastContainer = styled(ToastContainer)`
    .toastify-toast {
        background-color: #6B8E23 !important;
        color: #fff; 
        padding: 16px;
        border-radius: 8px;
    }
`;

// 성공 알림 표시 함수
export const notifySuccess = (message) => {
    toast.success(message, {
        className: 'toastify-success',
    });
};

export const NotificationToast = () => {
    return (
        <StyledToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            sx={{backgroundColor: '#6B8E23' }}
        />
    );
};
