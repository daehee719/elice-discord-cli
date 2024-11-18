import React, { useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Tabs, Tab, Box, Divider, TextField, styled, IconButton, InputAdornment, MenuItem, Typography } from '@mui/material';
import { searchUsers, sendFriendRequest } from '../../api/userFeature/userFeatureApi';
import { notifySuccess } from '../common/NotificationToast'; // 알림 함수 import

// 검색창 스타일
const CustomTextField = styled(TextField)(({ theme }) => ({
    width: '330px',
    '& .MuiInputBase-input': {
        color: '#757575', // 기본 텍스트 색상
        backgroundColor: '#E7EEE8', // 기본 배경 색상
    },
    '& .MuiInputLabel-root': {
        color: '#757575', // 레이블 색상
    },
    '& .MuiInputBase-input:focus': {
        color: '#757575', // 포커스 시 텍스트 색상
        backgroundColor: '#E7EEE8', // 포커스 시 배경 색상
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
        backgroundColor: '#E7EEE8',
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

// 검색 아이콘 스타일
const SearchButton = styled(IconButton)(({ theme }) => ({
    color: '#5D8363',
    backgroundColor: '#E7EEE8',
    '&:hover': {
        color: '#FFFFFF',
        backgroundColor: '#C2D6C6',
    },

}));

const DMHeader = ({ onViewChange }) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userRole = userInfo.role;

    const savedTab = localStorage.getItem('selectedTab') || 'dm';

    const [value, setValue] = useState(savedTab);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const resultsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (resultsRef.current && !resultsRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        onViewChange(newValue);
        localStorage.setItem('selectedTab', newValue);
    };

    const handleSearch = useCallback(async () => {
        if (!searchKeyword.trim()) {
            // 검색어가 비어 있으면 이전 결과 지우기
            setSearchResults([]);
            setShowResults(true);
            return;
        }

        try {
            const response = await searchUsers(searchKeyword);
            // 상태 코드 확인
            if (response.status === 200) {
                console.log("검색 결과 응답 확인:", response.data);
                setSearchResults(response.data);
                setShowResults(true);
            } else {
                console.error('검색 요청 실패:', response.statusText);
                setShowResults(false);
            }
        } catch (err) {
            console.error('검색 중 오류가 발생했습니다:', err);
            setShowResults(false);
        }
    }, [searchKeyword]);

    const handleSendFriendRequest = async (userId, nickname) => {
        try {
            await sendFriendRequest(userId);
            console.log('친구 요청이 성공적으로 보내졌습니다.');
            notifySuccess(`${nickname}님에게 친구 요청을 전송했습니다`); // 알림 메시지
        } catch (err) {
            console.log('친구 요청 중 오류가 발생했습니다.');
        }
    };

    const handleRequestClick = (userId, nickname) => {
        handleSendFriendRequest(userId, nickname);
        setShowResults(false); // 요청 후 검색 결과 숨기기 sx={{borderBottom: '4px solid #26282A'}}
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column'}}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#E7EEE8',
                padding: '15px 10px 0px',
                height: '80px'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="navigation tabs"
                        sx={{
                            height: '100%',
                            borderBottom: 1,
                            borderColor: 'divider',
                            bgcolor: '#E7EEE8',
                            color: '#9097A0',
                            display: 'flex',
                            alignItems: 'center',
                            flexGrow: 1,
                        }}
                        TabIndicatorProps={{ sx: {  width: '5px', bgcolor:'#3F4D0F' } }}
                    >
                        <Tab
                            label="DM"
                            value="dm"
                            sx={{
                                fontWeight: 600,
                                fontSize: '25px',
                                color: '#FFFFFF',
                                marginLeft: '10px',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                transition: 'color 0.3s ease, transform 0.3s ease',
                                '&.Mui-selected': {
                                    color: '#3F4D0F',
                                    transform: 'scale(1.05)',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                },
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                },
                                flexShrink: 0
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Divider orientation="vertical" flexItem sx={{ bgcolor: '#BFCEC1', width: '1px', height: '50%', mx: '16px', marginTop: 'auto', marginBottom: 'auto' }} />
                        </Box>
                        <Tab
                            label="친구"
                            value="friends"
                            sx={{
                                fontWeight: 600,
                                fontSize: '25px',
                                color: '#FFFFFF',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                transition: 'color 0.3s ease, transform 0.3s ease',
                                '&.Mui-selected': {
                                    color: '#3F4D0F',
                                    transform: 'scale(1.05)',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                },
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                },
                                flexShrink: 0
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Divider orientation="vertical" flexItem sx={{ bgcolor: '#BFCEC1', width: '1px', height: '50%', mx: '16px', marginTop: 'auto', marginBottom: 'auto' }} />
                        </Box>
                        <Tab
                            label="요청"
                            value="friend-requests"
                            sx={{
                                fontWeight: 600,
                                fontSize: '25px',
                                color: '#FFFFFF',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                transition: 'color 0.3s ease, transform 0.3s ease',
                                '&.Mui-selected': {
                                    color: '#3F4D0F',
                                    transform: 'scale(1.05)',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                },
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                },
                                flexShrink: 0
                            }}
                        />
                        {userRole === 'ROLE_ADMIN' && [
                            <Box key="user-manage-divider" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: '#BFCEC1', width: '1px', height: '50%', mx: '16px', marginTop: 'auto', marginBottom: 'auto' }} />
                            </Box>,
                            <Tab
                                key="user-manage"
                                label="회원"
                                value="user-manage"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '25px',
                                    color: '#FFFFFF',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                    transition: 'color 0.3s ease, transform 0.3s ease',
                                    '&.Mui-selected': {
                                        color: '#3F4D0F',
                                        transform: 'scale(1.05)',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                    },
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                    },
                                    flexShrink: 0
                                }}
                            />,
                            <Box key="report-manage-divider" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: '#BFCEC1', width: '1px', height: '50%', mx: '16px', marginTop: 'auto', marginBottom: 'auto' }} />
                            </Box>,
                            <Tab
                                key="report-manage"
                                label="신고"
                                value="report-manage"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '25px',
                                    color: '#FFFFFF',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                    transition: 'color 0.3s ease, transform 0.3s ease',
                                    '&.Mui-selected': {
                                        color: '#3F4D0F',
                                        transform: 'scale(1.05)',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                    },
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                    },
                                    flexShrink: 0
                                }}
                            />
                        ]}
                        {userRole !== 'ROLE_ADMIN' && [
                            <Box key="blocks-divider" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: '#BFCEC1', width: '1px', height: '50%', mx: '16px', marginTop: 'auto', marginBottom: 'auto' }} />
                            </Box>,
                            <Tab
                                key="blocks"
                                label="차단"
                                value="blocks"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '25px',
                                    color: '#FFFFFF',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                    transition: 'color 0.3s ease, transform 0.3s ease',
                                    '&.Mui-selected': {
                                        color: '#3F4D0F',
                                        transform: 'scale(1.05)',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                    },
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                    },
                                    flexShrink: 0
                                }}
                            />,
                            <Box key="reports-divider" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Divider orientation="vertical" flexItem sx={{ bgcolor: '#BFCEC1', width: '1px', height: '50%', mx: '16px', marginTop: 'auto', marginBottom: 'auto' }} />
                            </Box>,
                            <Tab
                                key="reports"
                                label="신고"
                                value="reports"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '25px',
                                    color: '#FFFFFF',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                                    transition: 'color 0.3s ease, transform 0.3s ease',
                                    '&.Mui-selected': {
                                        color: '#3F4D0F',
                                        transform: 'scale(1.05)',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                    },
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
                                    },
                                    flexShrink: 0
                                }}
                            />
                        ]}
                    </Tabs>
                </Box>
                <Box sx={{ position: 'relative', display: 'inline-block', alignItems: 'center', ml: '20px', mr: '10px', }}> {/* 검색창 위치 조정 */}
                    <CustomTextField
                        label="새로운 친구를 추가해 보세요!"
                        variant="outlined"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        sx={{ backgroundColor: '#2B2D31', ml: '10px' }}
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
                    />
                    {/* 검색 결과를 Box로 표시 */}
                    {showResults && (
                        <Box
                            ref={resultsRef}
                            sx={{
                                position: 'absolute',
                                top: 'calc(100% + 5px)',
                                left: 0,
                                width: '300px',
                                maxHeight: '300px',
                                bgcolor: '#D9D9D9',
                                color: '#FFFFFF',
                                overflowY: 'auto',
                                zIndex: 1500,
                                borderRadius: '4px',
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                                marginLeft: '10px'
                            }}
                        >
                            {searchResults.length === 0 ? (
                                <Typography sx={{ p: 2 }}>검색 결과가 없습니다.</Typography>
                            ) : (
                                searchResults.map((user) => (
                                    <MenuItem
                                        key={user.id}
                                        onClick={() => handleRequestClick(user.id, user.nickname)} // 클릭 시 handleRequestClick 호출
                                        sx={{ bgcolor: '#D9D9D9', color: '#9097A0', '&:hover': { bgcolor: '#C2D6C6', color: '#FFFFFF' } }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Typography variant="body1">{user.nickname}</Typography>
                                                <Typography variant="body2">{user.email}</Typography>
                                            </Box>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 이벤트 전파 막기
                                                    handleSendFriendRequest(user.id, user.nickname);
                                                }}
                                                sx={{ ml: 1 }}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                    </MenuItem>
                                ))
                            )}
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

DMHeader.propTypes = {
    onViewChange: PropTypes.func.isRequired,
};

export default DMHeader;
