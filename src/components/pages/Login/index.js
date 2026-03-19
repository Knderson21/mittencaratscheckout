/* eslint-disable max-len */
import {useGoogleLogin} from '@react-oauth/google';
import styles from './styles.module.scss';

// useLogin wraps @react-oauth/google's useGoogleLogin hook.
// It returns a `login` function that, when called, opens the Google OAuth
// consent screen. On success, the token is saved to both React state (via
// setToken) and localStorage (via setWithExpiry) so it persists across refreshes.
export const useLogin = (setToken) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // access_token is the OAuth token used to authorize Sheets API calls.
      // expires_in is the token lifetime in seconds (typically 3600 = 1 hour).
      // eslint-disable-next-line camelcase
      const {access_token, expires_in} = tokenResponse;
      setToken(access_token);
      setWithExpiry('authToken', access_token, expires_in);
    },
    // Request only the Sheets scope — the narrowest permission needed.
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  });

  return {login};
};

/**
 * Saves a value to localStorage paired with an expiry timestamp.
 * Stored shape: `{ token: "<value>", expiry: <unix_ms> }`
 *
 * @param {string} key - The localStorage key to write to (e.g. "authToken")
 * @param {string} value - The value to store (the OAuth access token string)
 * @param {number} ttl - Time-to-live in seconds (Google returns this as `expires_in`)
 * @returns {void}
 */
export const setWithExpiry = (key, value, ttl) => {
  const item = {
    token: value,
    expiry: Date.now() + ttl * 1000,
  };

  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Retrieves a value from localStorage, returning null if missing or expired.
 * Also removes the entry from localStorage when it has expired.
 * Called by useCheckout at submit time to validate the token before posting.
 *
 * @param {string} key - The localStorage key to read (e.g. "authToken")
 * @returns {string|null} The stored token string, or null if missing/expired
 */
export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);

  if (Date.now() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.token;
};

// Login is both the initial sign-in screen (when token is falsy) and the
// /settings page (where staff can refresh an expired token).
// It displays the current auth status and a "Sign in with Google" button.
const Login = ({
  token,
  setToken,
}) => {
  const {login} = useLogin(setToken);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.login}>
        <h1>Settings</h1>
        {/* Show auth status so staff can see at a glance whether they're logged in */}
        {token ? (
          <div>Log in token present</div>
        ): (
          <div>No log in token</div>
        )}
        <button className={styles.loginButton} onClick={() => login()}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default Login;
