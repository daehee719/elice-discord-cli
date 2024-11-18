import React, { useEffect, useState } from 'react';
import { deleteFriendship, getFriends, searchFriends } from '../../../api/userFeature/userFeatureApi';
import { TextField, List, ListItem, ListItemText, IconButton, CircularProgress, Typography, InputAdornment, Divider, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import styled from 'styled-components';
import ConfirmationModal from '../../common/ConfirmationModal';
import { NotificationToast, notifySuccess } from '../../common/NotificationToast';

// 전체 스타일
const Container = styled.div`
    background-color: #E7EEE8; // 전체 배경 색상
    padding: 20px 58px 58px 36px;
    height: 100vh;
    box-sizing: border-box;
`;

// 검색창 스타일
const CustomTextField = styled(TextField)(({ theme }) => ({
    width: '600px',
    '& .MuiInputBase-input': {
        color: '#757575', // 기본 텍스트 색상
        backgroundColor: '#C2D6C6', // 기본 배경 색상
    },
    '& .MuiInputLabel-root': {
        color: '#757575', // 레이블 색상
    },
    '& .MuiInputBase-input:focus': {
        color: '#757575', // 포커스 시 텍스트 색상
        backgroundColor: '#C2D6C6', // 포커스 시 배경 색상
    },
    '& .MuiInputLabel-root.Mui-focused': {
        color: '#5D8363', // 포커스 시 레이블 색상
    },
    '& .MuiInput-underline:before': {
        borderBottomColor: '#3C3C3B', // 기본 밑줄 색상
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#6B8E23', // 포커스 시 밑줄 색상
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#C2D6C6',
        '& fieldset': {
            borderColor: '#5D8363', // 기본 테두리 색상
        },
        '&:hover fieldset': {
            borderColor: '#5D8363', // 호버 시 테두리 색상
        },
        '&.Mui-focused fieldset': {
            borderColor: '#5D8363', // 포커스 시 테두리 색상
        },
    },
}));

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

// 채팅 아이콘 스타일
const ChatIconButtonStyle = styled(IconButton)(({ theme }) => ({
    backgroundColor: '#BDBDBD',
    borderRadius: '50%', 
    color: '#313338',
    margin: '0 4px',
    '&:hover': {
        color: '#FFFFFF',
        backgroundColor: '#6B8E23',
    },
}));

// 삭제 아이콘 스타일
const DeleteIconButtonStyle = styled(IconButton)(({ theme }) => ({
    backgroundColor: '#BDBDBD',
    borderRadius: '50%', 
    color: '#313338',
    margin: '0 4px',
    '&:hover': {
        color: '#FFFFFF',
        backgroundColor: 'darkred',
    },
}));

// 검색 아이콘 스타일
const SearchButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: '#88AA8D', 
    color: '#C2D6C6',
    margin: '0 4px', 
    '&:hover': {
        color: '#FFFFFF',
        backgroundColor: '#88AA8D', 
    },
}));

const FriendshipTab = () => {
    const [data, setData] = useState([]);
    const [searchData, setSearchData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [title, setTitle] = useState("모든 친구 - ");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getFriends();
                console.log("서버 응답", response);
                setData(response.data.content || []);
                setSearchData(response.data.content || []);
            } catch (err) {
                setError('친구 목록을 가져오는 데 문제가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();

        // 폴링 설정 (5초 간격으로 데이터 새로 고침)
        const intervalId = setInterval(fetchRequests, 5000);
        return () => clearInterval(intervalId);
        
    }, []);

    const handleUnFriendship = async (FriendshipId, nickname) => {
        setSelectedFriend({ id: FriendshipId, nickname });
        setOpenModal(true);
    };

    const handleDeleteFriendship = async () => {
        if (selectedFriend === null) return;

        try {
            await deleteFriendship(selectedFriend.id);
            setData((prevData) => prevData.filter((data) => data.id !== selectedFriend.id));
            setSearchData((prevData) => prevData.filter((data) => data.id !== selectedFriend.id));
            setOpenModal(false);
            notifySuccess(`${selectedFriend.nickname} 님의 삭제가 완료되었습니다.`);
        } catch (error) {
            console.error("친구 삭제 오류:", error);
            setOpenModal(false);
        }
    };

    const handleSearch = async () => {
        setTitle("검색 결과 - ");
        const trimmedKeyword = searchKeyword.trim();
        if (trimmedKeyword === "") {
            setSearchData(data);
        } else {
            try {
                const response = await searchFriends(trimmedKeyword);
                console.log("서버 응답", response);
                setSearchData(response.data.content || []);
            } catch (err) {
                setError('검색 중 오류가 발생했습니다.');
            }
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container>
            <header style={{ marginBottom: '16px' }}>
                <CustomTextField
                    label="닉네임으로 친구를 검색해 보세요!"
                    variant="outlined"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchButton
                                    edge="end"
                                    aria-label="search"
                                    onClick={handleSearch}
                                >
                                    <SearchIcon />
                                </SearchButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ margin: '10px' }}
                />
                <Typography variant="h6" style={{ margin: '10px 10px', fontSize: '15px', fontWeight: 600, color: '#5A5A5B' }}>
                    {title}{searchData.length}명
                </Typography>
                <Divider sx={{ width: '100%', my: 1, bgcolor: '#5A5A5B', marginLeft: '10px', marginRight: '0px' }} />
            </header>
            <List>
                {searchData.map((item) => (
                    <StyledListItem
                        key={item.id}
                        secondaryAction={
                            <div>
                                <ChatIconButtonStyle edge="end" aria-label="chat">
                                    <ChatIcon />
                                </ChatIconButtonStyle>
                                <DeleteIconButtonStyle edge="end" aria-label="delete" onClick={() => handleUnFriendship(item.id, item.friendNickname)}>
                                    <DeleteIcon />
                                </DeleteIconButtonStyle>
                            </div>
                        }
                    >
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
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                ':hover':{color: '#B3B3B3'}
                        }}> 
                            {item.friendNickname} 
                        </Typography>
                    </StyledListItem>
                ))}
            </List>

            {/* 삭제 확인 모달 */}
            <ConfirmationModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={handleDeleteFriendship}
                message={`친구 목록에서 ${selectedFriend ? selectedFriend.nickname : ''} 님을 삭제하시겠어요?`}
                title="친구 삭제하기"
            />

            <NotificationToast />
        </Container>
    );
};

export default FriendshipTab;