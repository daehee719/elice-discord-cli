import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { listFilesByChannelId } from '../../api/file/fileApi';
import { downloadFile } from '../../api/file/fileApi'; // 파일 다운로드 API

const ChannelFiles = ({ channelId, channelName }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            if (channelId) {
                try {
                    const response = await listFilesByChannelId(channelId);
                    // 파일 목록을 최신 순으로 정렬
                    const sortedFiles = response.data.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

                    setFiles(sortedFiles);
                    // 로컬스토리지에 파일 목록 저장
                    localStorage.setItem('uploadedFiles', JSON.stringify(sortedFiles));
                } catch (error) {
                    console.error('파일 목록 조회 중 에러 발생:', error);
                }
            }
        };

        fetchFiles();
    }, [channelId]);

    const handleDownload = async (fileKey, fileName) => {
        try {
            const response = await downloadFile(fileKey, fileName);

            // Blob을 사용하여 파일 다운로드
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);  // 파일 이름 설정
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('파일 다운로드 중 에러 발생:', error);
        }
    };

    return (
        <Box sx={{ position: 'relative', }}>
            <Box sx={{
                color: "#ffffff",
                position: 'sticky',
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: '#6a7b59',
                zIndex: 2,

                padding: '10px', paddingTop: '20px',
                margin: 0,  // margin 제거
                textAlign: 'center',
                borderBottom: '1px solid #f7f7f7'
            }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {channelId ? `#${channelName}에 업로드된 파일` : "채널을 선택해주세요"}
                </Typography>

            </Box>
            <List sx={{ paddingTop: '5px', zIndex: 1 }}> {/* 제목 아래 여백 추가 */}
                {files.map((file, index) => (
                    <ListItem
                        key={index}
                        button
                        onClick={() => handleDownload(file.fileKey, file.fileName)}
                        sx={{
                            transition: 'background-color 0.3s ease',
                            '&:hover': {
                                backgroundColor: '#4a5a39', // 마우스 호버 시 색상이 진해짐
                            },
                        }}>
                        <ListItemText
                            primary={file.fileName}
                            secondary={`업로드 일자: ${new Date(file.uploadedAt).toLocaleString()}`}
                            primaryTypographyProps={{ style: { color: "#f5f5f5" }, fontWeight: 'bold', }}
                            secondaryTypographyProps={{ style: { color: '#000000' } }}
                        />
                        <IconButton
                            sx={{ color: "#ffffff" }}
                            // onClick={() => handleDownload(file.fileKey, file.fileName)}  // 파일 키를 사용해 다운로드
                        >
                            <DownloadIcon />
                        </IconButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ChannelFiles;
