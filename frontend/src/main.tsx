// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 👈 BrowserRouterをインポート
import { App } from './App';
// import './index.css';
// import App from './pages/HomePage';
// import { API_BASE_URL } from './Client';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> 
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);