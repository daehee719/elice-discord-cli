import React, { useEffect, useState } from 'react';
import { getFriendRequests, responseFriendRequest} from '../../../api/userFeature/userFeatureApi';
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

// 수락 버튼 스타일
const AcceptButton = styled(Button)`
    background-color: #BDBDBD;
    color: #313338;
    &:hover {
        color: #FFFFFF;
        background-color: #6B8E23;
    }
    margin-left: 5px;
`;

// 거절 버튼 스타일
const RejectButton = styled(Button)`
    background-color: #BDBDBD;
    color: #313338;
    &:hover {
        color: #FFFFFF;
        background-color: darkRed;
    }
    margin-left: auto;
`;

const ReceiveRequests = () => {
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
                const response = await getFriendRequests('received');
                console.log("서버 응답", response);
                setData(response.data.content || []);
            } catch (err) {
                setError('받은 요청 목록을 가져오는 데 문제가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();

        // 폴링 설정 (5초 간격으로 데이터 새로 고침)
        const intervalId = setInterval(fetchRequests, 5000);
        return () => clearInterval(intervalId);
        
    }, []);

    const handleResponse = async (friendRequestId, requesterNickname, status) => {
        setSelectedRequestId(friendRequestId);
        setSelectedNickname(requesterNickname);
        setSelectStatus(status)
        setOpenModal(true);
    };

    const confirmResponse = async () => {
        if (selectedRequestId === null || selectStatus === null) return;

        try {
            await responseFriendRequest(selectedRequestId, selectStatus);
            setData((prevData)=> prevData.filter((data)=>data.friendRequestId !== selectedRequestId));
            notifySuccess(`${selectedNickname} 님의 요청을 ${selectStatus === 'ACCEPTED'? '수락' : '거절'}했습니다.`);
            console.log(`${selectStatus === 'ACCEPTED'? '수락' : '거절'} 완료`);
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
                    받은 요청 - {data.length}개
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
                                {item.requesterNickname}
                        </Typography>
                        <RejectButton onClick={() => handleResponse(item.friendRequestId, item.requesterNickname, 'REJECTED')}>거절</RejectButton>
                        <AcceptButton onClick={() => handleResponse(item.friendRequestId, item.requesterNickname, 'ACCEPTED')}>수락</AcceptButton>
                    </StyledListItem>
                ))}
            </List>

            {/* 응답 확인 모달 */}
            <ConfirmationModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={confirmResponse}
                message={`${selectedNickname} 님의 친구 요청을 ${selectStatus === 'ACCEPTED' ? '수락' : '거절'}하시겠어요?`}
                title="요청 응답"
            />

            <NotificationToast />
        </Container>
    );
};

export default ReceiveRequests;