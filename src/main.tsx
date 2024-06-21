import { HashRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './app.tsx'
import React from 'react'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
            <App />
        </HashRouter>
    </React.StrictMode>,
)