import React, { useEffect, useState } from 'react';
import { getBlocks, unblockUser } from '../../../api/userFeature/userFeatureApi';
import { Button, CircularProgress, Typography, Divider, Avatar, List, ListItem, ListItemText } from '@mui/material';
import styled from 'styled-components';
import ConfirmationModal from '../../common/ConfirmationModal';
import { NotificationToast, notifySuccess } from '../../common/NotificationToast';

// 전체 스타일
const Container = styled.div`
    background-color: #E7EEE8; // 전체 배경 색상
    padding: 96px 58px 58px 36px;
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

// 차단 해제 버튼 스타일
const UnblockButton = styled(Button)`
    background-color: #BDBDBD;
    color: #313338;
    &:hover {
        color: #FFFFFF;
        background-color: darkred;
    }
    margin-left: auto;
`;

const BlockTab = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedBlockId, setSelectedBlockId] = useState(null);
    const [selectedNickname, setSelectedNickname] = useState('');
    
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getBlocks();
                console.log("서버 응답", response);
                setData(response.data.content || []);
            } catch (err) {
                setError('차단 사용자 목록을 가져오는 데 문제가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();

        // 폴링 설정 (5초 간격으로 데이터 새로 고침)
        const intervalId = setInterval(fetchRequests, 5000);
        return () => clearInterval(intervalId);
        
    }, []);

    const handleUnblock = async (blockId, nickname) => {
        setSelectedBlockId(blockId);
        setSelectedNickname(nickname);
        setOpenModal(true);
    };

    const confirmUnblock = async () => {
        if (selectedBlockId === null) return;

        try {
            await unblockUser(selectedBlockId);
            setData((prevData) => prevData.filter((data) => data.blockId !== selectedBlockId));
            notifySuccess(`${selectedNickname} 님의 차단이 해제되었습니다.`);
        } catch (error) {
            console.error("차단 해제 오류:", error);
        } finally {
            setOpenModal(false);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <header style={{ marginBottom: '16px' }}>
                <Typography variant="h6" style={{ margin: '10px 10px', fontSize: '15px', fontWeight: 600, color: '#5A5A5B' }}>
                    차단 사용자 - {data.length}명
                </Typography>
                <Divider sx={{ width: '100%', my: 1, bgcolor: '#5A5A5B', marginLeft: '10px', marginRight: '0px' }} />
            </header>
            <List>
                {data.map((item) => (
                    <StyledListItem key={item.blockId}>
                        <Avatar
                            src={item.imageUrl}
                            sx={{  width: 45, height: 45, marginRight: 2 }}
                        />
                        <Typography 
                            sx={{ 
                                fontSize: '25px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '5px',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                ':hover':{color: '#B3B3B3'}
                            }}> 
                                {item.blockedNickname} 
                        </Typography>
                        <UnblockButton onClick={() => handleUnblock(item.blockId, item.blockedNickname)}>차단 해제</UnblockButton>
                    </StyledListItem>
                ))}
            </List>

            {/* 차단 해제 확인 모달 */}
            <ConfirmationModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={confirmUnblock}
                message={`${selectedNickname} 님을 차단 해제하시겠어요?`}
                title="차단 해제"
            />

            <NotificationToast />
        </Container>
    );
};

export default BlockTab;