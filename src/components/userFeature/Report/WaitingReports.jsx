import React, { useEffect, useState } from 'react';
import { deleteReport, editReport, getReports } from '../../../api/userFeature/userFeatureApi';
import { CircularProgress, Typography, Divider, Avatar, List, ListItem, ListItemText, Button, Box } from '@mui/material';
import styled from 'styled-components';
import UpdateReport from './UpdateReport';
import DetailReport from './DetailReport';
import ConfirmationModal from '../../common/ConfirmationModal';
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
const EditButton = styled(Button)`
    background-color: #BDBDBD;
    color: #313338;
    &:hover {
        color: #FFFFFF;
        background-color: #6B8E23;
    }
    margin-left: 5px;
    margin-right: 5px;
`;

const DeleteButton = styled(Button)`
    background-color: #BDBDBD;
    color: #313338;
    &:hover {
        color: #FFFFFF;
        background-color: darkred;
    }
    margin-left: auto;
`;

const BoxContainer = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between; // 아이템을 좌우로 정렬
    width: 100%;
`;

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // yyyy-mm-dd 형식
};

const WaitingReports = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const [selectNickname, setSelectedNickname] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [selectedReportId, setSelectedReportId] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await getReports('WAITING');
                console.log("서버 응답", response);
                setData(response.data.content || []);
            } catch (err) {
                setError('대기 중인 신고 목록을 가져오는 데 문제가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();

        // 폴링 설정 (5초 간격으로 데이터 새로 고침)
        const intervalId = setInterval(fetchReports, 5000);
        return () => clearInterval(intervalId);
        
    }, []);

    const handleDelete = (id, reportedNickname) => {
        setSelectedReportId(id);
        setSelectedNickname(reportedNickname);
        setOpenConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (selectedReportId === null) return;

        try {
            await deleteReport(selectedReportId);
            setData((prevData) => prevData.filter((report) => report.id !== selectedReportId));
            notifySuccess('신고가 철회되었습니다.');
            console.log('신고 철회 완료');
        } catch (error) {
            console.error(error);
        } finally {
            setOpenConfirmModal(false);
        }
    };

    const handleUpdate = async () => {
        if (!selectedReport) return;
        try {
            const updatedReport = await editReport(selectedReport.id, {
                reportReason: selectedReport.reportReason,
                file: selectedReport.file,
            });
            setData((prevData) =>
                prevData.map((item) => (item.id === updatedReport.id ? updatedReport : item))
            );
            notifySuccess('신고가 수정되었습니다.');
            closeEditModal();
        } catch (error) {
            console.error("수정 실패:", error);
        }
    };

    const openEditModalHandler = (report) => {
        setSelectedReport(report);
        setOpenEditModal(true);
    };

    const openDetailModalHandler = (report) => {
        setSelectedReport(report);
        setOpenDetailModal(true);
    };

    const closeEditModal = () => {
        setOpenEditModal(false);
        setSelectedReport(null);
    };

    const closeDetailModal = () => {
        setOpenDetailModal(false);
        setSelectedReport(null);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <header style={{ marginBottom: '16px' }}>
                <Typography variant="h6" style={{ margin: '10px 0px', fontSize: '15px', fontWeight: 600, color: '#5A5A5B' }}>
                    대기 중인 신고 - {data.length}개
                </Typography>
                <Divider sx={{ width: '100%', my: 1, bgcolor: '#5A5A5B', marginLeft: '0px', marginRight: '0px' }} />
            </header>
            <List>
                {data.map((report) => (
                    <StyledListItem key={report.id}>
                        <Avatar
                            src={report.imageUrl}
                            sx={{  width: 45, height: 45, marginRight: 2 }}
                        />
                        <BoxContainer>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }} onClick={() => openDetailModalHandler(report)}>
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
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                                <EditButton onClick={() => openEditModalHandler(report)} sx={{marginRight: '5px'}}>수정</EditButton>
                                <DeleteButton onClick={() => handleDelete(report.id, report.reportedNickname)}>철회</DeleteButton>
                            </Box>
                        </BoxContainer>
                    </StyledListItem>
                ))}
            </List>
            {selectedReport && (
                <>
                    <UpdateReport
                        open={openEditModal}
                        handleClose={closeEditModal}
                        report={selectedReport}
                        onUpdate={handleUpdate}
                    />
                    <DetailReport
                        open={openDetailModal}
                        handleClose={closeDetailModal}
                        report={selectedReport}
                    />
                </>
            )}
            <ConfirmationModal
                open={openConfirmModal}
                onClose={() => setOpenConfirmModal(false)}
                onConfirm={confirmDelete}
                message={`${selectNickname} 님에 대한 신고를 철회하시겠어요?`}
                title="철회 확인"
            />
            <NotificationToast />
        </Container>
    );
};

export default WaitingReports;
