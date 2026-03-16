/* eslint-disable max-len */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {HashRouter} from 'react-router-dom';

const basename = '/';
const root = ReactDOM.createRoot(document.getElementById('root'));
const oauth = process.env.REACT_APP_OAUTH_CLIENT_ID;
root.render(
    <GoogleOAuthProvider clientId={oauth}>
      <HashRouter basename={basename}>
        <App />
      </HashRouter>
    </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example, reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
