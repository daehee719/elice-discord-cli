import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import ReceiveRequests from '../FriendRequest/ReceiveRequsts';
import SentRequests from '../FriendRequest/SentRequests';

const StyledContainer = {
    backgroundColor: '#E7EEE8',
    minHeight: '100vh',
    padding: '16px',
    boxSizing: 'border-box',
};

const StyledTabs = {
    backgroundColor: '#C2D6C6', 
    borderRadius: '2px',
    marginRight: '40px',
};

const FriendRequestTab = () => {
    const [activeTab, setActiveTab] = useState('received');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={StyledContainer}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="friend requests tabs"
                    sx={StyledTabs}
                    TabIndicatorProps={{ sx: { display: 'none' } }} 
                >
                    <Tab
                        value="received"
                        label="받은 요청"
                        sx={{
                            color: '#FFFFFF',
                            '&.Mui-selected': {
                                fontWeight: 'bold',
                                color: '#5D8363', 
                            },
                            '&:hover': {
                                fontWeight: 'string',
                                color: '#BDBDBD',
                            },
                        }}
                    />
                    <Tab
                        value="sent"
                        label="보낸 요청"
                        sx={{
                            color: '#FFFFFF',
                            '&.Mui-selected': {
                                fontWeight: 'bold',
                                color: '#5D8363',
                            },
                            '&:hover': {
                                color: '#BDBDBD', 
                            },
                        }}
                    />
                </Tabs>
            </Box>
            <Box sx={{ p: 2 }}>
                {activeTab === 'received' ? <ReceiveRequests /> : <SentRequests />}
            </Box>
        </Box>
    );
};

export default FriendRequestTab;
