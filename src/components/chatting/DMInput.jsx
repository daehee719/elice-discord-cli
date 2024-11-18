import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography } from '@mui/material';
import { AttachFile as AttachFileIcon, EmojiEmotions as EmojiIcon, Delete as DeleteIcon, Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import 'emoji-picker-element';
import { uploadFile } from '../../api/file/fileApi';
import { addReaction } from '../../api/reaction/reactionApi';
import { sendMessageAndGetId } from '../../api/chat/chatApi';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE_MB = 5; // 최대 파일 크기 제한 (5MB)

const DMInput = ({ selectedUser, senderId, senderName }) => {
    const [message, setMessage] = useState('');
    const [pickerVisible, setPickerVisible] = useState(false);
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');  // 파일 이름을 저장할 상태 추가
    const fileInputRef = useRef(null);  // useRef로 input 요소 참조
    const pickerRef = useRef(null); // 이모지 선택기 참조
    const messageRef = useRef(message); // 메시지 상태를 참조하는 useRef
    const textFieldRef = useRef(null); // TextField 요소 참조
    const emojiButtonRef = useRef(null); // 이모지 버튼을 참조

    useEffect(() => {
        messageRef.current = message; // 최신 메시지 상태를 유지
    }, [message]);


    useEffect(() => {
        const picker = pickerRef.current;

        const handleEmojiClick = (event) => {
            const unicode = event.detail?.unicode;
            if (unicode && textFieldRef.current) {
                const input = textFieldRef.current;
                const start = input.selectionStart;
                const end = input.selectionEnd;

                // 현재 커서 위치에서 메시지 삽입
                const newText = message.slice(0, start) + unicode + message.slice(end);
                setMessage(newText);

                // 이모지 삽입 후 커서를 이모지 뒤로 이동
                setTimeout(() => {
                    input.setSelectionRange(start + unicode.length, start + unicode.length);
                    input.focus();
                }, 0);

            }
        };

        if (picker) {
            picker.addEventListener('emoji-click', handleEmojiClick);
        }

        return () => {
            if (picker) {
                picker.removeEventListener('emoji-click', handleEmojiClick);
            }
        };
    }, [message]);

    //파일 선택
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile) {
            // 파일 크기 제한 (5MB 이하만 허용)
            const fileSizeInMB = selectedFile.size / (1024 * 1024); // 바이트를 MB로 변환
            if (fileSizeInMB > MAX_FILE_SIZE_MB) {
                alert(`파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE_MB}MB 이하의 파일만 전송할 수 있습니다.`);
                fileInputRef.current.value = ''; // 파일 선택 취소
                return;
            }

            setFile(selectedFile);
            setFileName(selectedFile.name);  // 선택된 파일의 이름을 상태로 설정

            // 파일 정보를 콘솔에 출력
            console.log("Selected file:");
            console.log(`- Name: ${selectedFile.name}`);
            console.log(`- Size: ${selectedFile.size} bytes`);
            console.log(`- Type: ${selectedFile.type}`);
        } else {
            console.log("No file selected or file selection was canceled.");
        }
    };

    const handleFileEdit = () => {
        fileInputRef.current.click(); // 파일 선택 창 다시 열기
    };

    const handleFileRemove = () => {
        setFile(null);
        setFileName('');
        fileInputRef.current.value = ''; // input 값을 초기화하여 파일 선택을 다시 할 수 있게 함
    };

    //메세지 전송 - 메세지, 파일, 이모지
    const handleSendMessage = async (e) => {

        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (!message.trim() && !file) {
            alert('메세지를 입력해주세요.');
            return;
        }

        // 이모지를 추출하지만 메시지에는 포함된 상태로 유지
        const emojis = extractEmojis(message);
        const textContent = message;

        try {

            // 임시 메시지 ID 생성(테스트 용)
            const messageId = uuidv4();
            // // 메시지 전송 및 messageId 획득
            // const response = await sendMessageAndGetId(selectedUser, textContent, senderId, senderName);
            // const messageId = response.data.messageId; // 서버에서 반환된 messageId

            if (file) {
                const fileRequestDto = {  messageId, userId: senderId }; // 메시지 ID로 fileRequestDto 생성
                console.log("fileRequestDto:", fileRequestDto);  // fileRequestDto를 로그로 확인
                await uploadFile(file, fileRequestDto);
                setFile(null); // 파일 업로드 후 상태 초기화
                setFileName(''); // 파일 이름도 초기화
            }

            if (emojis.length > 0) {
                for (const emoji of emojis) {
                    await addReaction(messageId, emoji); // Reaction 엔티티에 이모지 저장
                }
            }


            setMessage(''); // 메시지 전송 후 입력 필드 초기화
            setFile(null); // 파일 상태 초기화
            setFileName(''); // 파일 이름 초기화

        } catch (error) {
            console.error('메세지 전송 중 에러 발생..:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 기본 엔터 키 동작(줄 바꿈)을 막음
            handleSendMessage();
        }
    };

    //이모지 추출
    const extractEmojis = (text) => {
        return text.match(/[\p{Emoji}\u200d]+/gu) || [];
    };

    const handleTogglePicker = () => {
        setPickerVisible(!pickerVisible);

        if (!pickerVisible) {
            setTimeout(() => {
                const picker = pickerRef.current;
                if (picker) {
                    picker.addEventListener('emoji-click', (event) => {
                        const unicode = event.detail?.unicode;
                        if (unicode) {
                            setMessage((prevMessage) => prevMessage + unicode);
                        }
                    });
                }
            }, 0);
        }
    };

    useEffect(() => {
        if (pickerVisible && emojiButtonRef.current && pickerRef.current) {
            const emojiButtonRect = emojiButtonRef.current.getBoundingClientRect();
            pickerRef.current.style.position = 'absolute';
            pickerRef.current.style.top = `${emojiButtonRect.top - pickerRef.current.offsetHeight - 10}px`;
            pickerRef.current.style.left = `${emojiButtonRect.left - 300}px`; // 이 값을 조정하여 이모지 창을 더 왼쪽으로 이동
            pickerRef.current.style.zIndex = 10;
        }
    }, [pickerVisible]);



    return (
        <Box sx={{ p: 2 }}>
            {fileName && (
                <Box sx={{ display: 'flex', width: 'fit-content', alignItems: 'center', mb: 1, backgroundColor: '#565656', borderRadius: '4px' }}>
                    <Typography variant="body2" sx={{ color: "white", flexGrow: 1, padding: '10px' }}>
                        {fileName}
                    </Typography>
                    <IconButton sx={{ color: 'white' }} onClick={handleFileEdit}>
                        <EditIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'red' }} onClick={handleFileRemove}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}

            <input
                type="file"
                ref={fileInputRef} // ref로 요소 참조
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            {pickerVisible && (
                <Box
                    ref={pickerRef}
                    sx={{
                        position: 'absolute',
                        zIndex: 10,
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <emoji-picker></emoji-picker>

                    <Box sx={{ position: 'absolute', display: 'inline-block' }}>

                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: -40,
                                right: 7,
                                backgroundColor: 'white',
                                zIndex: 1,
                                '&:hover': {
                                    backgroundColor: 'gray',
                                },
                            }}
                            onClick={() => setPickerVisible(false)}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            )}

            <Paper component="form" onSubmit={handleSendMessage} sx={{ p: "2px 4px", display: "flex", alignItems: "center", bgcolor: "#C2D6C6" }}>
                <IconButton sx={{ p: "10px", color: 'white' }} onClick={() => fileInputRef.current.click()}>
                    <AttachFileIcon />
                </IconButton>

                <TextField
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={selectedUser ? `${selectedUser.name}님께 메시지 보내기` : "대화를 시작할 상대를 선택해주세요"}
                    variant="standard"
                    value={message}
                    inputRef={textFieldRef} // TextField 요소 참조
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown} // 엔터 키를 누르면 메시지 전송
                    InputProps={{
                        disableUnderline: true,
                    }}
                />

                <IconButton sx={{ p: "10px" }} onClick={handleTogglePicker} ref={emojiButtonRef}>
                    <EmojiIcon sx={{ color: "white", "&:hover": { color: "gold" } }} />

                </IconButton>

            </Paper>

        </Box>
    );
};

export default DMInput;