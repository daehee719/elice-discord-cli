import React, { useEffect, useState } from 'react';
import { adminGetReports } from '../../../api/userFeature/userFeatureApi';
import { CircularProgress, Typography, Divider, Avatar, List, ListItem, Box } from '@mui/material';
import styled from 'styled-components';
import AdminDetailReport from './AdminDetailReport';
import { notifySuccess, NotificationToast } from '../../common/NotificationToast';

// 전체 스타일
const Container = styled.div`
    background-color: #E7EEE8;
    padding: 96px 58px 58px 36px;
    height: 100vh;
    box-sizing: border-box;
`;

// 신고 목록 리스트 아이템 스타일
const StyledListItem = styled(ListItem)`
    display: flex;
    align-items: center;
    padding: 8px 0;
`;

// 상태 텍스트 스타일
const StatusText = styled(Typography)`
    border-radius: 3px;
    background-color: #E0DB65;
    color: #FFFFFF;
    padding: 2px 10px;
    display: inline-block;
    white-space: nowrap;
    margin-left: auto; // 오른쪽에 위치하게 함
    &:hover {
        color: #9097A0;
    }
`;

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

const AdminReportTab = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await adminGetReports('WAITING');
                setData(response.data.content || []);
            } catch (err) {
                setError('신고 목록을 가져오는 데 문제가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();

        // 폴링 설정 (5초 간격으로 데이터 새로 고침)
        const intervalId = setInterval(fetchRequests, 5000);
        return () => clearInterval(intervalId);
        
    }, []);

    const openDetailModalHandler = (report) => {
        setSelectedReport(report);
        setOpenDetailModal(true);
    };

    const closeDetailModal = () => {
        setOpenDetailModal(false);
        setSelectedReport(null);
    };

    const handleReportProcessed = (reportId) => {
        setData(prevData => prevData.filter(report => report.id !== reportId));
        notifySuccess('신고 응답 완료');
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <header style={{ marginBottom: '16px' }}>
                <Typography variant="h6" style={{ margin: '10px 16px', fontSize: '15px', fontWeight: 600, color: '#5A5A5B' }}>
                    신고 목록 - {data.length}개
                </Typography>
                <Divider sx={{ width: '98%', my: 1, bgcolor: '#5A5A5B', marginLeft: '10px', marginRight: '10px' }} />
            </header>
            <List>
                {data.map((item) => (
                    <StyledListItem key={item.id}>
                        <Avatar
                            src={item.imageUrl}
                            sx={{  width: 45, height: 45, marginRight: 2, marginLeft: 2 }}
                        />
                        <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }} onClick={() => openDetailModalHandler(item)}>
                            <Typography sx={{ fontSize: '25px', fontWeight: 'bold', color: '#FFFFFF', marginRight: '5px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', ':hover':{color: '#B3B3B3'}}}>
                                {item.reportedNickname}
                            </Typography>
                            <Typography sx={{ fontSize: '15px', fontWeight: 'bold', color: '#FFFFFF', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', }}>
                                ({formatDate(item.createdAt)})
                            </Typography>
                        </Box>
                        <StatusText>검토 대기</StatusText>
                    </StyledListItem>
                ))}
            </List>

            {selectedReport && (
                <AdminDetailReport
                    open={openDetailModal}
                    handleClose={closeDetailModal}
                    report={selectedReport}
                    onReportProcessed={handleReportProcessed} // 콜백 전달
                />
            )}

            <NotificationToast />
        </Container>
    );
};

export default AdminReportTab;

