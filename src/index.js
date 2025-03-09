/* eslint-disable max-len */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {GoogleOAuthProvider} from '@react-oauth/google';
import { HashRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}>
      <HashRouter basename='/'>
        <App />
      </HashRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
