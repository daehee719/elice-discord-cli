import React, { useState, useEffect } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    Typography,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import { Add as AddIcon, Tag as TagIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getChannels, createChannel, updateChannel, deleteChannel } from "../../api/channel/channelApi";

// 채널 목록 컴포넌트
const ChannelList = ({ serverId, selectedChannel, onChannelSelect }) => {
    const [channels, setChannels] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editChannel, setEditChannel] = useState(null);

    // 서버 ID가 변경될 때마다 채널 목록 가져오기
    useEffect(() => {
        if (serverId) {
            fetchChannels();
        }
    }, [serverId]);

    // 채널 목록 가져오기
    const fetchChannels = async () => {
        try {
            const response = await getChannels(serverId);
            setChannels(response.data);
        } catch (error) {
            console.error('채널 목록을 가져오는데 실패했습니다:', error);
        }
    };

    // 새 채널 생성 처리
    const handleCreateChannel = async () => {
        try {
            await createChannel({ name: newChannelName, serverId });
            setIsCreateModalOpen(false);
            setNewChannelName('');
            fetchChannels();
        } catch (error) {
            console.error('채널 생성에 실패했습니다:', error);
        }
    };

    // 채널 수정 처리
    const handleUpdateChannel = async () => {
        try {
            await updateChannel(editChannel.id, editChannel.name);
            setIsEditModalOpen(false);
            setEditChannel(null);
            fetchChannels();
        } catch (error) {
            console.error('채널 수정에 실패했습니다:', error);
        }
    };

    // 채널 삭제 처리
    const handleDeleteChannel = async (channelId) => {
        try {
            await deleteChannel(channelId);
            fetchChannels();
        } catch (error) {
            console.error('채널 삭제에 실패했습니다:', error);
        }
    };

    return (
        <>
            <List>
                {/* 채널 목록 헤더 */}
                <ListItem>
                    <Typography variant="caption" sx={{ color: 'grey.500' }}>채팅 채널</Typography>
                    <IconButton
                        size="small"
                        onClick={() => setIsCreateModalOpen(true)}
                        sx={{ ml: 'auto', mr: '-8px' }}
                    >
                        <AddIcon fontSize="small" />
                    </IconButton>
                </ListItem>
                {/* 채널 목록 아이템 */}
                {channels.map((channel) => (
                    <ListItem
                        button
                        key={channel.id}
                        selected={selectedChannel && selectedChannel.id === channel.id}
                        onClick={() => onChannelSelect(channel)}
                    >
                        <ListItemIcon>
                            <TagIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={channel.name} />
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditChannel(channel);
                                setIsEditModalOpen(true);
                            }}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChannel(channel.id);
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </ListItem>
                ))}
            </List>

            {/* 채널 생성 모달 */}
            <Dialog
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                PaperProps={{
                    style: { backgroundColor: '#88AA8D' },
                }}
            >
                <DialogTitle style={{ color: '#e0f2e9' }}>새 채널 만들기</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="채널 이름"
                        type="text"
                        fullWidth
                        value={newChannelName}
                        onChange={(e) => setNewChannelName(e.target.value)}
                        InputLabelProps={{
                            style: { color: '#b8d8c7' },
                        }}
                        InputProps={{
                            style: { color: '#e0f2e9' },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCreateModalOpen(false)} style={{ color: '#b8d8c7' }}>취소</Button>
                    <Button onClick={handleCreateChannel} style={{ color: '#e0f2e9' }}>생성</Button>
                </DialogActions>
            </Dialog>

            {/* 채널 수정 모달 */}
            <Dialog
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                PaperProps={{
                    style: { backgroundColor: '#88AA8D' },
                }}
            >
                <DialogTitle style={{ color: '#e0f2e9' }}>채널 수정하기</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="채널 이름"
                        type="text"
                        fullWidth
                        value={editChannel?.name || ''}
                        onChange={(e) => setEditChannel({ ...editChannel, name: e.target.value })}
                        InputLabelProps={{
                            style: { color: '#b8d8c7' },
                        }}
                        InputProps={{
                            style: { color: '#e0f2e9' },
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditModalOpen(false)} style={{ color: '#b8d8c7' }}>취소</Button>
                    <Button onClick={handleUpdateChannel} style={{ color: '#e0f2e9' }}>저장</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ChannelList;