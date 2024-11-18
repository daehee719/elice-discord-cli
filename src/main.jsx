import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import registerServiceWorker from './components/voiceChat/RegisterServiceWorker';

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
registerServiceWorker();
