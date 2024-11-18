import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    List,
    ListItemText,
    Divider,
    TextField,
    IconButton,
    Avatar,
    Toolbar,
    AppBar,
    InputAdornment,
    Popover,
    Modal,
} from "@mui/material";
import {
    Group as GroupIcon,
    Search as SearchIcon,
    ExpandMore as ExpandMoreIcon,
    Tag as TagIcon,
    Close as CloseIcon,
    Archive as ArchiveIcon,
} from "@mui/icons-material";
import VoiceChatComponent from "../../components/voiceChat/VoiceChatComponent";
import ChannelList from "../../components/channel/ChannelList";
import ChatInput from "../../components/chatting/ChatInput.jsx";
import ChannelFiles from "../../components/file/ChannelFiles";
import ChatMessages from "../../components/chatting/ChatMessages";
import {
    connectWebSocket,
    subscribeToChannel,
    disconnectWebSocket,
    joinChannel,
    sendMessage,
} from "../../api/chat/chatApi";

// 색상 설정
const customColors = {
    primary: "#88AA8D",
    secondary: "#C2D6C6",
    background: "#E7EEE8",
    text: "#333333",
};

const ChattingPage = () => {
    const location = useLocation();
    const serverId = location.state?.id;
    const serverName = location.state?.name;

    const [selectedChattingChannel, setSelectedChattingChannel] = useState(null);
    const [showUserList, setShowUserList] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFileModalOpen, setIsFileModalOpen] = useState(false);
    const [messages, setMessages] = useState({});
    const [files, setFiles] = useState([]);
    const messagesEndRef = useRef(null);
    const [forceRender, setForceRender] = useState(false);

    // 추가: 마지막 메시지 시간을 추적하기 위한 ref
    const lastMessageTimeRef = useRef(0);

    // 사용자 정보
    const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
    const userId = userInfo.userId;
    const userName = userInfo.nickname;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? "simple-popover" : undefined;

    const toggleUserList = () => {
        setShowUserList(!showUserList);
    };

    // 채널 선택
    const handleChannelSelect = (channel) => {
        setSelectedChattingChannel(channel);
        setFiles([]);
        console.log(`채널 선택: ${channel.name}`);
        setMessages((prevMessages) => ({
            ...prevMessages,
            [channel.id]: prevMessages[channel.id] || [],
        }));
    };

    // 파일 모달
    const handleOpenFileModal = (event) => {
        if (selectedChattingChannel) {
            setIsFileModalOpen(true);
        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleCloseFileModal = () => {
        setIsFileModalOpen(false);
    };

    const handleClosePopover = () => {
        setAnchorEl(null);
    };

    const openFile = Boolean(anchorEl);

    // WebSocket 연결 설정
    useEffect(() => {
        let subscription;

        const setupWebSocket = async () => {
            try {
                await connectWebSocket(
                    () => {
                        console.log("웹소켓 연결 성공");
                        if (selectedChattingChannel) {
                            console.log(`채널 구독: ${selectedChattingChannel.id}`);
                            subscription = subscribeToChannel(selectedChattingChannel.id, handleReceiveMessage);
                            joinChannel(selectedChattingChannel.id);
                        }
                    },
                    (error) => {
                        console.error("웹소켓 연결 오류:", error);
                    }
                );
            } catch (error) {
                console.error("웹소켓 설정 오류:", error);
            }
        };

        setupWebSocket();

        // 컴포넌트 언마운트 시 WebSocket 연결 해제
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, [selectedChattingChannel]);

    // 메시지 수신 스크롤 조정
    useEffect(() => {
        if (selectedChattingChannel) {
            scrollToBottom();
        }
    }, [messages, selectedChattingChannel]);

    // 메시지 수신
    const handleReceiveMessage = useCallback(
        (message) => {
            console.log("메시지 수신:", message.content);
            const channelId = selectedChattingChannel?.id;
            if (!channelId) return;

            // 추가: 1초 이내 메시지 필터링
            const currentTime = Date.now();
            if (currentTime - lastMessageTimeRef.current < 1000) {
                console.log("1초 이내 메시지 무시:", message.content);
                return;
            }
            lastMessageTimeRef.current = currentTime;

            const newMessage = {
                id: message.id,
                senderId: message.senderId || "",
                senderName: message.senderName || "알 수 없음",
                content: message.content || "",
                createdTime: message.timestamp || new Date().toISOString(),
            };

            setMessages((prevMessages) => {
                const channelMessages = prevMessages[channelId] || [];
                return {
                    ...prevMessages,
                    [channelId]: [...channelMessages, newMessage],
                };
            });

            setForceRender((prev) => !prev); // 메시지 수신 시 리렌더링 트리거
        },
        [selectedChattingChannel]
    );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // 현재 선택된 채널의 메시지 가져오기
    const currentMessages = selectedChattingChannel ? messages[selectedChattingChannel.id] || [] : [];

    const handleFileUploadComplete = () => {
        // 메시지를 다시 불러오거나 상태를 강제로 업데이트
        const storedMessage = JSON.parse(localStorage.getItem("lastReceivedMessage"));
        if (storedMessage && storedMessage.id) {
            const messageId = storedMessage.id;
            setMessages((prevMessages) => {
                const channelMessages = prevMessages[selectedChattingChannel.id] || [];
                const updatedMessages = channelMessages.map((message) => (message.id === messageId ? { ...message } : message));
                return {
                    ...prevMessages,
                    [selectedChattingChannel.id]: updatedMessages,
                };
            });
        }
    };

    return (
        // 색상 변경
        <Box sx={{ display: "flex", height: "100vh", bgcolor: customColors.background, color: customColors.text }}>
            {/* Channel sidebar */}
            <Box sx={{ width: 220, bgcolor: customColors.secondary, borderRight: 1, borderColor: customColors.primary }}>
                <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: 14, color: customColors.text }} variant="h6">
                        {serverName}
                    </Typography>
                    <IconButton sx={{ color: customColors.primary }} size="small">
                        <ExpandMoreIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ bgcolor: customColors.primary }} />

                {/* 채팅 채널 리스트 */}
                <ChannelList
                    serverId={serverId}
                    selectedChannel={selectedChattingChannel}
                    onChannelSelect={handleChannelSelect}
                />

                {/* VoiceChat Channel */}
                <VoiceChatComponent serverId={serverId} />
            </Box>

            {/* Main content */}
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                {/* Channel header */}
                {/* 색상 적용 */}
                <AppBar position="static" sx={{ bgcolor: customColors.primary }}>
                    <Toolbar>
                        <TagIcon fontSize="medium" sx={{ color: customColors.background, mr: "5px", ml: "-5px" }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: customColors.background }}>
                            {selectedChattingChannel ? selectedChattingChannel.name : "채널을 선택하세요"}
                        </Typography>
                        <IconButton sx={{ color: customColors.background, paddingRight: "13px" }} onClick={handleOpenFileModal}>
                            <ArchiveIcon />
                        </IconButton>

                        <Popover
                            open={openFile}
                            anchorEl={anchorEl}
                            onClose={handleClosePopover}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "center",
                            }}
                            PaperProps={{
                                sx: {
                                    backgroundColor: customColors.primary,
                                    color: customColors.background,
                                    borderRadius: "8px",
                                },
                            }}
                        >
                            <Box sx={{ p: 1.8 }}>
                                <Typography sx={{ fontSize: "15px" }}>채널을 먼저 선택해주세요.</Typography>
                            </Box>
                        </Popover>

                        <TextField
                            sx={{
                                mr: "5px",
                                width: "200px",
                                bgcolor: customColors.secondary,
                                "& .MuiInputBase-input::placeholder": {
                                    color: customColors.text,
                                    opacity: 0.7,
                                    fontSize: "14px",
                                    pl: "10px",
                                },
                            }}
                            placeholder="검색하기"
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: customColors.text }} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <IconButton sx={{ p: "10px" }} onClick={toggleUserList}>
                            <GroupIcon sx={{ width: "30px", height: "30px", mr: "-15px", color: customColors.background }} />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {/* Messages area */}
                {/* 색상 적용 */}
                <Box
                    sx={{
                        flexGrow: 1,
                        overflow: "auto",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: customColors.background,
                    }}
                >
                    <ChatMessages messages={currentMessages} forceRender={forceRender} />
                    <div ref={messagesEndRef} />
                </Box>

                {/* Message input */}
                {/* 색상 적용 */}
                <Box sx={{ p: 2, bgcolor: customColors.secondary }}>
                    <ChatInput
                        selectedChattingChannel={selectedChattingChannel}
                        senderId={userId}
                        senderName={userName}
                        onFileUploadComplete={handleFileUploadComplete}
                    />
                </Box>
            </Box>

            {/* File Modal */}
            <Modal
                open={isFileModalOpen}
                onClose={handleCloseFileModal}
                aria-labelledby="channel-files-title"
                sx={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 3 }}
            >
                {/* 색상 적용 파일 모달 */}
                <Box
                    sx={{
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        paddingInline: 5,
                        borderRadius: 2,
                        width: "400px",
                        position: "relative",
                        backgroundColor: "#6a7b59",
                        maxHeight: "58vh",
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                            width: "8px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#f5f5f5",
                            borderRadius: 3, // 박스와 스크롤바 모두 동일한 곡률로 설정
                        },
                        "&::-webkit-scrollbar-track": {
                            backgroundColor: "#6a7b59",
                            borderTopRightRadius: 10,
                            borderBottomRightRadius: 10,
                        },
                    }}
                >
                    <IconButton
                        onClick={handleCloseFileModal}
                        sx={{
                            p: "10px",
                            position: "fixed",
                            top: 155,
                            right: 425,
                            zIndex: 1,
                            color: "#f5f5f5",
                            backgroundColor: "none",
                            "&:hover": { backgroundColor: "#6a7b59", color: "#101010" },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <ChannelFiles channelId={selectedChattingChannel?.id} channelName={selectedChattingChannel?.name} />
                </Box>
            </Modal>
            {/* User list */}
            {showUserList && (
                // 색상 적용
                <Box sx={{ width: 240, bgcolor: customColors.secondary, p: 2 }}>
                    <Typography variant="caption" color={customColors.text}>
                        온라인 — 1
                    </Typography>
                    <List>
                        {["이름", "이름1", "이름", "이름"].map((name, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Avatar sx={{ mr: 1, bgcolor: customColors.primary }} onClick={handleClick}>
                                        이
                                    </Avatar>
                                    <ListItemText primary={name} sx={{ color: customColors.text }} />
                                    <Popover
                                        id={popoverId}
                                        open={open}
                                        anchorEl={anchorEl}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: "center",
                                            horizontal: "right",
                                        }}
                                        transformOrigin={{
                                            vertical: "center",
                                            horizontal: "left",
                                        }}
                                        sx={{ ml: "10px" }}
                                    >
                                        <Typography sx={{ p: 2, bgcolor: customColors.background, color: customColors.text }}>
                                            The content of the Popover.
                                        </Typography>
                                    </Popover>
                                </Box>
                            </Box>
                        ))}
                    </List>
                </Box>
            )}
        </Box>
    );
};

export default ChattingPage;