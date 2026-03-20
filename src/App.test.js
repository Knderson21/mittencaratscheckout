import {render, screen} from '@testing-library/react';
import {HashRouter} from 'react-router-dom';
import {GoogleOAuthProvider} from '@react-oauth/google';
import App from './App';

test('renders login page when not authenticated', async () => {
  render(
    <GoogleOAuthProvider clientId="test-client-id">
      <HashRouter>
        <App />
      </HashRouter>
    </GoogleOAuthProvider>
  );
  const settingsHeading = await screen.findByText(/settings/i);
  expect(settingsHeading).toBeInTheDocument();
});
