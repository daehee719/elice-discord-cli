import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import WaitingReports from '../Report/WaitingReports';
import CompleteReports from '../Report/CompleteReports';

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

const ReportTab = () => {
    const [activeTab, setActiveTab] = useState('waiting');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={StyledContainer}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="report tabs"
                    sx={StyledTabs}
                    TabIndicatorProps={{ sx: { display: 'none' } }} 
                >
                    <Tab
                        value="waiting"
                        label="대기 중"
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
                        value="complete"
                        label="처리 완료"
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
                {activeTab === 'waiting' ? <WaitingReports /> : <CompleteReports />}
            </Box>
        </Box>
    );
};

export default ReportTab;
