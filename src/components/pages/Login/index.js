/* eslint-disable max-len */
import {useGoogleLogin} from '@react-oauth/google';
import styles from './styles.module.scss';

// Login Hook
export const useLogin = (setToken) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // eslint-disable-next-line camelcase
      const {access_token, expires_in} = tokenResponse;
      setToken(access_token);
      setWithExpiry('potionToken', access_token, expires_in);
    },
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  });

  return {login};
};

// Sets token to local storage with expiration
export const setWithExpiry = (key, value, ttl) => {
  const item = {
    token: value,
    expiry: Date.now() + ttl * 1000,
  };

  localStorage.setItem(key, JSON.stringify(item));
};

// Gets token
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

const Login = ({
  token,
  setToken,
}) => {
  const {login} = useLogin(setToken);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.login}>
        <h1>Settings</h1>
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
