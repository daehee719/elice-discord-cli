import React, { useEffect, useState } from 'react';
import { adminGetUsers, unblockUser, adminEditUserRole, adminDeleteUser } from '../../../api/userFeature/userFeatureApi';
import { Button, CircularProgress, Typography, Avatar, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import styled from 'styled-components';
import ConfirmationModal from '../../common/ConfirmationModal';
import { NotificationToast, notifySuccess } from '../../common/NotificationToast';

// 전체 스타일
const Container = styled.div`
    background-color: #E7EEE8;
    padding: 84px 58px 58px 36px;
    height: 100vh;
    box-sizing: border-box;
`;

// 사용자 정보 삭제 버튼 스타일
const DeleteUserButton = styled(Button)`
    height: 36px;
    width: 95px;
    margin-top: 2px;
    margin-bottom: 2px;
    border: 1px solid #212121;
    background-color: #BDBDBD;
    color: #313338;
    fontWeight: bold;
    &:hover {
        color: #FFFFFF;
        background-color: darkred;
        border: 2px solid darkred;
    }
    margin-left: auto;
`;

// 테이블 컴포넌트 스타일
const StyledTable = styled(Table)`
    && {
        border-collapse: collapse;
        width: 100%;
        margin-left: 10px;

        /* 테이블 헤드 구분선 색상 */
        thead {
            tr {
                border-bottom: 2px solid #5A5A5B; /* 헤드 구분선 색상 */
            }
            th {
                font-size: 15px; /* 글씨 크기 */
                color: #5A5A5B; /* 글씨 색상 */
                font-weight: bold; /* 글씨 두께 */
            }
        }

        /* 테이블 바디 구분선 색상 */
        tbody {
            tr {
                border-bottom: 1px solid #2B2D31; /* 바디 구분선 색상 */
            }
        }

        /* 각 셀의 구분선 색상 */
        td, th {
            border-bottom: 1px solid transparent;
        }
    }
`;

const AdminUserManageTab = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [openModal, setOpenModal] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);
    const [selectedNickname, setSelectedNickname] = useState('');
    const [roleChangeUserId, setRoleChangeUserId] = useState(null);
    const [roleChangeValue, setRoleChangeValue] = useState('');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await adminGetUsers();
                setData(response.data.content || []);
            } catch (err) {
                setError('회원 목록을 가져오는 데 문제가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();

        // 폴링 설정 (5초 간격으로 데이터 새로 고침)
        const intervalId = setInterval(fetchRequests, 5000);
        return () => clearInterval(intervalId);
        
    }, []);

    const handleDeleteUser = async (userId, nickname) => {
        setSelectedDeleteId(userId);
        setSelectedNickname(nickname);
        setOpenModal(true);
    };

    const confirmDelete = async () => {
        if (selectedDeleteId === null) return;

        try {
            await adminDeleteUser(selectedDeleteId);
            setData((prevData) => prevData.filter((data) => data.id !== selectedDeleteId));
            notifySuccess(`${selectedNickname} 님의 정보가 삭제되었습니다.`);
        } catch (error) {
            console.error("회원 삭제 오류:", error);
        } finally {
            setOpenModal(false);
        }
    };

    const handleRoleChange = async (userId, newRole, nickname) => {
        try {
            await adminEditUserRole(userId, newRole);
            setData((prevData) => prevData.map((user) => 
                user.id === userId ? { ...user, role: newRole } : user
            ));
            notifySuccess(`${nickname}님의 권한이 변경되었습니다.`);
        } catch (error) {
            console.error("역할 변경 오류:", error);
        }
    };

    const handleRoleChangeClick = (userId, currentRole) => {
        setRoleChangeUserId(userId);
        setRoleChangeValue(currentRole);
    };

    const handleRoleChangeSelect = (userId, newRole, nickname) => {
        handleRoleChange(userId, newRole, nickname);
        setRoleChangeUserId(null); // 역할 변경 후 선택 해제
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <StyledTable 
                aria-label="basic table"
                variant="plane"
                color="neutral"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>총 {data.length}명</TableCell>
                        <TableCell>닉네임</TableCell>
                        <TableCell>이메일</TableCell>
                        <TableCell>권한</TableCell>
                        <TableCell>관리</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <Avatar
                                    src={item.imageUrl}
                                    sx={{width: 45, height: 45, marginRight: 2 }}
                                />
                            </TableCell>
                            <TableCell>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#FFFFFF', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', ':hover':{color: '#B3B3B3'}}}> {item.nickname} </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#FFFFFF', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)', ':hover':{color: '#B3B3B3'} }}> {item.email} </Typography>
                            </TableCell>
                            <TableCell>
                            <FormControl sx={{ minWidth: 120, marginRight: 2 }}>
                                <Select
                                    color="success"
                                    value={roleChangeUserId === item.id ? roleChangeValue : item.role}
                                    onChange={(e) => handleRoleChangeSelect(item.id, e.target.value, item.nickname)}
                                    sx={{
                                        height: '36px',
                                        width: '95px',
                                        color: '#313338',
                                        fontWeight: 'semiBold',
                                        backgroundColor: '#BDBDBD',
                                        border: '1px solid #313338', 
                                        '&:hover': {
                                            color: '#FFFFFF',
                                            backgroundColor: '#6B8E23',
                                            border: '2px solid #6B8E23' 
                                        },
                                        '&.Mui-focused': {
                                            border: '2px solid #6B8E23' 
                                        }
                                    }}
                                >
                                    <MenuItem value="ROLE_USER">회원</MenuItem>
                                    <MenuItem value="ROLE_ADMIN">관리자</MenuItem>
                                </Select>
                            </FormControl>
                            </TableCell>
                            <TableCell>
                                <DeleteUserButton onClick={() => handleDeleteUser(item.id, item.nickname)}>회원 삭제</DeleteUserButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </StyledTable>
            <ConfirmationModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={confirmDelete}
                message={`${selectedNickname} 님의 정보를 삭제하시겠어요?`}
                title="회원 삭제"
            />
            <NotificationToast />
        </Container>
    );
};

export default AdminUserManageTab;