import React, { useEffect, useState } from 'react';
import { deleteFriendRequest, getFriendRequests, responseFriendRequest} from '../../../api/userFeature/userFeatureApi';
import { CircularProgress, Typography, Divider, Avatar, List, ListItem, ListItemText, Button, Box } from '@mui/material';
import styled from 'styled-components';
import ConfirmationModal from '../../common/ConfirmationModal';
import { NotificationToast, notifySuccess } from '../../common/NotificationToast';

// 전체 스타일
const Container = styled.div`
    background-color: #E7EEE8; // 전체 배경 색상
    padding: 16px;
    height: 100vh;
    box-sizing: border-box;
`;

// 사용자 목록 리스트 아이템 스타일
const StyledListItem = styled(ListItem)(({ theme }) => ({
    '& .MuiListItemText-primary': {
        fontSize: '30px', 
        fontWeight: 600, 
        color: '#FFFFFF',
    },
    display: 'flex',
    alignItems: 'center',
}));

// 삭제, 철회 버튼 스타일
const DeleteButton = styled(Button)`
    background-color: #BDBDBD;
    color: #313338;
    padding: 2px 10px;
    &:hover {
        color: #FFFFFF;
        background-color: darkred;
    }
    margin-left: auto;
`;

// 상태 텍스트 스타일
const StatusText = styled(Typography)`
        border-radius: 10%;
        background-color: ${(props) => (props.status === 'WAITING' ? '#E0DB65' : props.status === 'ACCEPTED' ? '#2D5542' : '#5C282B')};
        color: #FFFFFF;
        font-size: '12px';
        margin-left: 15px;
        padding: 2px 10px;
        display: inline-block; // 박스의 너비를 텍스트의 길이에 맞게 조정
        white-space: nowrap; // 텍스트 줄 바꿈 방지
        &:hover {
        color: #9097A0;
    }
    `;

const SentRequests = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectStatus, setSelectStatus] = useState('');
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [selectedNickname, setSelectedNickname] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getFriendRequests('sent');
                console.log("서버 응답", response);
                setData(response.data.content || []);
            } catch (err) {
                setError('보낸 요청 목록을 가져오는 데 문제가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();

        // 폴링 설정 (5초 간격으로 데이터 새로 고침)
        const intervalId = setInterval(fetchRequests, 5000);
        return () => clearInterval(intervalId);
        
    }, []);

    const renderStatusText = (status) => {
        switch (status) {
            case 'WAITING':
                return '대기';
            case 'ACCEPTED':
                return '수락';
            case 'REJECTED':
                return '거절';
            default:
                return '알 수 없음';
        }
    };

    const renderButtonText = (status) => {
        return status === 'WAITING' ? '취소' : '삭제';
    };

    const actionText = selectStatus === 'WAITING' ? '철회' : '삭제';
    const title = selectStatus === 'WAITING' ? '철회' : '삭제';
    const message = `${selectedNickname} 님에게 전송한 요청을 ${actionText}하시겠어요?`;


    const handleDelete = async (friendRequestId, requesterNickname, status) => {
        setSelectedRequestId(friendRequestId);
        setSelectedNickname(requesterNickname);
        setSelectStatus(status)
        setOpenModal(true);
    };

    const confirmDelete = async () => {
        if (selectedRequestId === null) return;

        try {
            await deleteFriendRequest(selectedRequestId);
            setData((prevData)=> prevData.filter((data)=>data.friendRequestId !== selectedRequestId));
            notifySuccess(`${selectedNickname} 님에게 전송한 요청을 ${selectStatus === 'WAITING'? '철회' : '삭제'}했습니다.`);
            console.log(`${selectStatus === 'WAITING'? '철회' : '삭제'} 완료`);
        } catch (error) {
            console.error(error);
        } finally {
            setOpenModal(false);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <header style={{ marginBottom: '16px' }}>
                <Typography variant="h6" style={{ margin: '10px 0px', fontSize: '15px', fontWeight: 600, color: '#5A5A5B' }}>
                    보낸 요청 - {data.length}개
                </Typography>
                <Divider sx={{ width: '100%', my: 1, bgcolor: '#5A5A5B', marginLeft: '0px', marginRight: '0px' }} />
            </header>
            <List>
                {data.map((item) => (
                    <StyledListItem key={item.friendRequestId}>
                        <Avatar
                            src={item.imageUrl}
                            sx={{  width: 45, height: 45, marginRight: 2 }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                            <Typography 
                                    sx={{ 
                                        fontSize: '25px', 
                                        fontWeight: 'bold', 
                                        color: '#FFFFFF', 
                                        marginBottom: '5px', 
                                        marginRight:'5px',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                        ':hover':{color: '#B3B3B3'}
                                    }}> 
                                    {item.recipientNickname}
                            </Typography>
                            <StatusText status={item.requestStatus}>{renderStatusText(item.requestStatus)}</StatusText>
                        </Box>
                        <DeleteButton onClick={() => handleDelete(item.friendRequestId, item.recipientNickname, 'ACCEPTED')}>{renderButtonText(item.requestStatus)}</DeleteButton>
                    </StyledListItem>
                ))}
            </List>

            {/* 응답 확인 모달 */}
            <ConfirmationModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={confirmDelete}
                message={message}
                title={title}
            />

            <NotificationToast />
        </Container>
    );
};

export default SentRequests;