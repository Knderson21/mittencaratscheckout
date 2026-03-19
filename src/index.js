import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {HashRouter} from 'react-router-dom';

// The OAuth client ID is stored in .env as REACT_APP_OAUTH_CLIENT_ID.
// It identifies this app to Google's auth servers.
const oauth = process.env.REACT_APP_OAUTH_CLIENT_ID;

// HashRouter uses hash-based URLs (e.g. /#/settings instead of /settings).
// This lets GitHub Pages serve the app without server-side routing config —
// the server only needs to serve index.html; routing is handled client-side.
//
// GoogleOAuthProvider wraps the entire app so any component can access
// Google OAuth functionality (via @react-oauth/google hooks) without extra setup.
const basename = '/';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <GoogleOAuthProvider clientId={oauth}>
      <HashRouter basename={basename}>
        <App />
      </HashRouter>
    </GoogleOAuthProvider>
);

reportWebVitals();
