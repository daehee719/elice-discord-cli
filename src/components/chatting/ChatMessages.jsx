// import { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import { Box, Typography, Avatar, Link, MenuItem, Menu } from '@mui/material';
// import { Download as DownloadIcon } from '@mui/icons-material';
// import { downloadFile } from '../../api/file/fileApi';
// import { listFilesByMessageId } from '../../api/file/fileApi';
// import { blockUser, sendFriendRequest } from '../../api/userFeature/userFeatureApi';
// import { notifySuccess } from '../common/NotificationToast';
// import CreateReport from '../userFeature/Report/CreateReport';
// import { useNavigate } from 'react-router-dom';
//
// const ChatMessages = memo(({ messages, files }) => {
//     const navigate = useNavigate();
//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//     const userId = userInfo.userId.toString();
//
//     const [selectedUserId, setSelectedUserId] = useState("");
//     const [menuAnchorEl, setMenuAnchorEl] = useState(null);
//     const [reportModalOpen, setReportModalOpen] = useState(false); // 신고 모달 상태 변수
//
//     const [filesMap, setFilesMap] = useState({}); // 메시지 ID와 파일들을 매칭할 맵
//
//     useEffect(() => {
//         const fetchFilesForMessages = async () => {
//             const newFilesMap = {};
//             for (const message of messages) {
//                 // 파일 불러오기 API 호출
//                 const response = await listFilesByMessageId(message.id);
//                 if (response && response.data) {
//                     newFilesMap[message.id] = response.data; // 메시지 ID를 키로 파일 저장
//                 }
//             }
//             setFilesMap(newFilesMap); // 상태 업데이트
//         };
//
//         if (messages.length) {
//             fetchFilesForMessages();
//         }
//     }, [messages]);
//
//     const handleDownload = async (fileKey, fileName) => {
//         try {
//             const response = await downloadFile(fileKey, fileName);
//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', fileName);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (error) {
//             console.error('파일 다운로드 실패:', error);
//         }
//     };
//
//     // 메뉴 리스트 관련 코드
//     const handleMenuOpen = (event, id) => {
//         setSelectedUserId(id);
//         setMenuAnchorEl(event.currentTarget);
//     };
//     const handleMenuClose = () => {
//         setMenuAnchorEl(null);
//     };
//     const menuOpen = Boolean(menuAnchorEl);
//     const menuId = menuOpen ? 'user-menu' : undefined;
//     const handleMenuAction = async (action) => {
//         try {
//             switch (action) {
//                 case 'editProfile':
//                     console.log('프로필 편집하기');
//                     navigate('/myPage');
//                     break;
//                 case 'invite':
//                     console.log('서버 초대하기');
//                     // 서버 초대 HTTP 요청 코드 추가
//                     break;
//                 case 'addFriend':
//                     if (selectedUserId) {
//                         console.log('친구 추가하기');
//                         await sendFriendRequest(selectedUserId);
//                         notifySuccess('친구 요청이 성공적으로 보내졌습니다.');
//                     }
//                     break;
//                 case 'message':
//                     console.log('메세지');
//                     // DM 연결 HTTP 요청 코드 추가
//                     break;
//                 case 'block':
//                     if (selectedUserId) {
//                         console.log('차단하기');
//                         await blockUser(selectedUserId);
//                         notifySuccess('차단이 완료되었습니다.');
//                     }
//                     break;
//                 case 'report':
//                     if (selectedUserId) {
//                         setReportModalOpen(true);
//                     } else {
//                         console.error('신고할 사용자 ID가 설정되지 않았습니다.');
//                     }
//                     break;
//                 default:
//                     break;
//             }
//         } catch (error) {
//             console.error('처리 중 오류가 발생했습니다:', error);
//         } finally {
//             handleMenuClose();
//         }
//     };
//
//     const menuItems = userId === selectedUserId
//         ? [
//             <MenuItem key="editProfile" onClick={() => handleMenuAction('editProfile')}>프로필 편집하기</MenuItem>
//         ]
//         : [
//             <MenuItem key="invite" onClick={() => handleMenuAction('invite')}>서버 초대하기</MenuItem>,
//             <MenuItem key="addFriend" onClick={() => handleMenuAction('addFriend')}>친구 추가하기</MenuItem>,
//             <MenuItem key="message" onClick={() => handleMenuAction('message')}>메세지</MenuItem>,
//             <MenuItem key="block" onClick={() => handleMenuAction('block')}>차단</MenuItem>,
//             <MenuItem key="report" onClick={() => handleMenuAction('report')}>신고</MenuItem>
//         ];
//
//     return (
//         <Box sx={{ flexGrow: 1, overflow: "auto", p: 2, display: 'flex', flexDirection: 'column' }}>
//             {messages.map((message) => (
//                 <Box key={message.id} sx={{ mb: 2 }}>
//                     <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <Avatar sx={{ mr: 1 }}>{message.senderName[0]}</Avatar>
//                         <Typography
//                             variant="subtitle1"
//                             onClick={(event) => handleMenuOpen(event, message.senderId)}
//                         >
//                             {message.senderName}
//                         </Typography>
//                         <Typography variant="caption" sx={{ ml: 1 }}>
//                             {new Date(message.createdTime).toLocaleString()}
//                         </Typography>
//                     </Box>
//                     <Typography sx={{ ml: 6 }}>{message.content}</Typography>
//                     {/* 파일 목록 표시 */}
//                     {filesMap[message.id] && filesMap[message.id].map((file, index) => (
//                         <Box key={index} sx={{ ml: 6, mt: 1, display: 'flex', alignItems: 'center' }}>
//                             <DownloadIcon sx={{ mr: 1, color: 'gray' }} />
//                             <Link onClick={() => handleDownload(file.fileKey, file.fileName)} sx={{ cursor: 'pointer', color: 'primary.main' }}>
//                                 {file.fileName}
//                             </Link>
//                         </Box>
//                     ))}
//                 </Box>
//             ))}
//             <Menu
//                 id={menuId}
//                 anchorEl={menuAnchorEl}
//                 open={menuOpen}
//                 onClose={handleMenuClose}
//             >
//                 {menuItems}
//             </Menu>
//
//             <CreateReport
//                 open={reportModalOpen}
//                 handleClose={() => setReportModalOpen(false)}
//                 reportedUserId={selectedUserId}
//             />
//         </Box>
//     );
// });
//
// ChatMessages.propTypes = {
//     messages: PropTypes.arrayOf(
//         PropTypes.shape({
//             id: PropTypes.string.isRequired,
//             senderId: PropTypes.string.isRequired,
//             senderName: PropTypes.string.isRequired,
//             createdTime: PropTypes.string.isRequired,
//             content: PropTypes.string.isRequired,
//         })
//     ).isRequired,
// };
//
// ChatMessages.displayName = 'ChatMessages';
//
// export default ChatMessages;

import { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Avatar, Link, MenuItem, Menu, IconButton } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { downloadFile } from '../../api/file/fileApi';
import { listFilesByMessageId } from '../../api/file/fileApi';
import { blockUser, sendFriendRequest } from '../../api/userFeature/userFeatureApi';
import { notifySuccess } from '../common/NotificationToast';
import CreateReport from '../userFeature/Report/CreateReport';
import { useNavigate } from 'react-router-dom';

const ChatMessages = memo(({ messages }) => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userId = userInfo.userId.toString();

    const [selectedUserId, setSelectedUserId] = useState("");
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [reportModalOpen, setReportModalOpen] = useState(false); // 신고 모달 상태 변수

    const [filesMap, setFilesMap] = useState({});

    // 파일 정보를 메시지에 매핑하는 함수
    const fetchFilesForMessages = async (messages) => {
        const newFilesMap = {};
        for (const message of messages) {
            const response = await listFilesByMessageId(message.id);
            if (response && response.data) {
                newFilesMap[message.id] = response.data;
            }
        }
        setFilesMap(newFilesMap); // 파일 정보 업데이트
    };

    useEffect(() => {
        fetchFilesForMessages(messages);
    }, [messages]);  // 메시지가 변경될 때마다 호출됨
    const handleDownload = async (fileKey, fileName) => {
        try {
            const response = await downloadFile(fileKey, fileName);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('파일 다운로드 실패:', error);
        }
    };

    // 메뉴 리스트 관련 코드
    const handleMenuOpen = (event, id) => {
        setSelectedUserId(id);
        setMenuAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };
    const menuOpen = Boolean(menuAnchorEl);
    const menuId = menuOpen ? 'user-menu' : undefined;
    const handleMenuAction = async (action) => {
        try {
            switch (action) {
                case 'editProfile':
                    console.log('프로필 편집하기');
                    navigate('/myPage');
                    break;
                case 'invite':
                    console.log('서버 초대하기');
                    // 서버 초대 HTTP 요청 코드 추가
                    break;
                case 'addFriend':
                    if (selectedUserId) {
                        console.log('친구 추가하기');
                        await sendFriendRequest(selectedUserId);
                        notifySuccess('친구 요청이 성공적으로 보내졌습니다.');
                    }
                    break;
                case 'message':
                    console.log('메세지');
                    // DM 연결 HTTP 요청 코드 추가
                    break;
                case 'block':
                    if (selectedUserId) {
                        console.log('차단하기');
                        await blockUser(selectedUserId);
                        notifySuccess('차단이 완료되었습니다.');
                    }
                    break;
                case 'report':
                    if (selectedUserId) {
                        setReportModalOpen(true);
                    } else {
                        console.error('신고할 사용자 ID가 설정되지 않았습니다.');
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('처리 중 오류가 발생했습니다:', error);
        } finally {
            handleMenuClose();
        }
    };

    const menuItems = userId === selectedUserId
        ? [
            <MenuItem key="editProfile" onClick={() => handleMenuAction('editProfile')}>프로필 편집하기</MenuItem>
        ]
        : [
            <MenuItem key="invite" onClick={() => handleMenuAction('invite')}>서버 초대하기</MenuItem>,
            <MenuItem key="addFriend" onClick={() => handleMenuAction('addFriend')}>친구 추가하기</MenuItem>,
            <MenuItem key="message" onClick={() => handleMenuAction('message')}>메세지</MenuItem>,
            <MenuItem key="block" onClick={() => handleMenuAction('block')}>차단</MenuItem>,
            <MenuItem key="report" onClick={() => handleMenuAction('report')}>신고</MenuItem>
        ];

    // 새로 추가된 시간 포맷팅 함수
    const formatMessageTime = (timeString) => {
        const date = new Date(timeString);
        return format(date, 'a h:mm', { locale: ko });
    };

    return (
        <Box sx={{ flexGrow: 1, overflow: "auto", p: 2, display: 'flex', flexDirection: 'column' }}>
            {messages.map((message) => (
                <Box key={message.id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 1 }}>{message.senderName[0]}</Avatar>
                        <Typography
                            variant="subtitle1"
                            onClick={(event) => handleMenuOpen(event, message.senderId)}
                        >
                            {message.senderName}
                        </Typography>
                        <Typography variant="caption" sx={{ ml: 1 }}>
                            {formatMessageTime(message.createdTime)}
                        </Typography>
                    </Box>
                    <Typography sx={{ ml: 6 }}>{message.content}</Typography>
                    {/* 파일 목록 표시 */}
                    {filesMap[message.id] && filesMap[message.id].map((file, index) => (
                        <Box key={index} sx={{ ml: 6, mt: 1, width: 'fit-content', display: 'flex', alignItems: 'center', backgroundColor: '#414c43', borderRadius: '4px', padding: '8px' }}>
                            <Typography variant="body2" sx={{ flexGrow: 1, color: "#f5f5f5", paddingRight: '10px' }}>
                                {file.fileName}
                            </Typography>
                            <IconButton sx={{ color: '#f5f5f5', padding: '0 5px' }} onClick={() => handleDownload(file.fileKey, file.fileName)}>
                                <DownloadIcon sx={{ fontSize: '20px' }} />
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            ))}
            <Menu
                id={menuId}
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
            >
                {menuItems}
            </Menu>

            <CreateReport
                open={reportModalOpen}
                handleClose={() => setReportModalOpen(false)}
                reportedUserId={selectedUserId}
            />
        </Box>
    );
});

ChatMessages.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            senderId: PropTypes.string.isRequired,
            senderName: PropTypes.string.isRequired,
            createdTime: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
        })
    ).isRequired,
};

ChatMessages.displayName = 'ChatMessages';

export default ChatMessages;