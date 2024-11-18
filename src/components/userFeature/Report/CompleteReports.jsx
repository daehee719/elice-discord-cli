import React, { useEffect, useState } from 'react';
import { deleteReport, getReports } from '../../../api/userFeature/userFeatureApi';
import { CircularProgress, Typography, Divider, Avatar, List, ListItem, ListItemText, Button, Box } from '@mui/material';
import styled from 'styled-components';
import ConfirmationModal from '../../common/ConfirmationModal';
import DetailReport from './DetailReport'; // DetailReport 컴포넌트 import
import { NotificationToast, notifySuccess } from '../../common/NotificationToast';

// 전체 스타일
const Container = styled.div`
    background-color: #E7EEE8; // 전체 배경 색상
    padding: 16px;
    height: 100vh;
    box-sizing: border-box;
`;

// 리스트 아이템 스타일
const StyledListItem = styled(ListItem)(({ theme }) => ({
    '& .MuiListItemText-primary': {
        fontSize: '18px', 
        fontWeight: 600, 
        color: '#FFFFFF',
    },
    display: 'flex',
    alignItems: 'center',
}));

// 버튼 스타일
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
    border-radius: 3px; // 10% 둥글게 설정
    background-color: ${(props) => (props.status === 'ACCEPTED' ? '#2D5542' : '#5C282B')};
    color: #BDBDBD;
    margin-left: 15px;
    width: 95px;
    padding: 2px 10px;
    font-size: 12px;
    text-align: center; // 텍스트 가운데 정렬
    display: inline-flex; // 텍스트의 길이에 맞게 박스 조정
    align-items: center; // 텍스트 가운데 정렬
    justify-content: center; // 텍스트 가운데 정렬
    white-space: nowrap; // 텍스트 줄 바꿈 방지
    overflow: hidden; // 넘치는 텍스트 숨기기
    box-sizing: border-box; // 패딩과 테두리 포함
    &:hover {
        color: #FFFFFF;
    }
`;

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // yyyy-mm-dd 형식
};

const CompleteReports = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState(null);
    const [selectedNickname, setSelectedNickname] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await getReports('RESPONSE_COMPLETED');
                console.log("서버 응답", response);
                setData(response.data.content || []);
            } catch (err) {
                setError('처리 완료된 신고 목록을 가져오는 데 문제가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();

        // 폴링 설정 (5초 간격으로 데이터 새로 고침)
        const intervalId = setInterval(fetchReports, 5000);
        return () => clearInterval(intervalId);
        
    }, []);

    const handleDelete = async (id, nickname) => {
        setSelectedReportId(id);
        setSelectedNickname(nickname);
        setOpenModal(true);
    };

    const confirmDelete = async () => {
        if (selectedReportId === null) return;

        try {
            await deleteReport(selectedReportId);
            setData((prevData) => prevData.filter((report) => report.id !== selectedReportId));
            notifySuccess('신고가 삭제되었습니다.');
            console.log('신고 삭제 완료');
        } catch (error) {
            console.error(error);
        } finally {
            setOpenModal(false);
        }
    };

    const openDetailModalHandler = (report) => {
        setSelectedReport(report);
        setOpenDetailModal(true);
    };

    const closeDetailModal = () => {
        setOpenDetailModal(false);
        setSelectedReport(null);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    const statusMapping = {
        ACCEPTED: '경고 조치 완료',
        INADEQUATE_REASON: '부적절한 사유',
        INSUFFICIENT_EVIDENCE: '증거 불충분',
    };

    return (
        <Container>
            <header style={{ marginBottom: '16px' }}>
                <Typography variant="h6" style={{ margin: '10px 0px', fontSize: '15px', fontWeight: 600, color: '#5A5A5B' }}>
                    처리 완료 신고 - {data.length}개
                </Typography>
                <Divider sx={{ width: '100%', my: 1, bgcolor: '#5A5A5B', marginLeft: '0px', marginRight: '0px' }} />
            </header>
            <List>
                {data.map((report) => (
                    <StyledListItem key={report.id} onClick={() => openDetailModalHandler(report)}>
                        <Avatar
                            src={report.imageUrl}
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
                                {report.reportedNickname} 
                            </Typography>
                            <Typography 
                                sx={{ 
                                    fontSize: '15px', 
                                    fontWeight: 'bold', 
                                    color: '#FFFFFF', 
                                    marginBottom: '2px',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                    ':hover':{color: '#B3B3B3'}
                                }}>
                                    ({formatDate(report.createdAt)})
                                 </Typography>
                            <StatusText status={report.reportStatus}>{statusMapping[report.reportStatus] || '알 수 없음'}</StatusText>
                        </Box>
                        <DeleteButton onClick={(e) => { e.stopPropagation(); handleDelete(report.id, report.reportedNickname); }}>삭제</DeleteButton>
                    </StyledListItem>
                ))}
            </List>

            <ConfirmationModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={confirmDelete}
                message={`${selectedNickname} 님에 대한 신고 내역을 삭제하시겠어요?`}
                title="신고 삭제"
            />

            {selectedReport && (
                <DetailReport
                    open={openDetailModal}
                    handleClose={closeDetailModal}
                    report={selectedReport}
                />
            )}

            <NotificationToast />
        </Container>
    );
};

export default CompleteReports;