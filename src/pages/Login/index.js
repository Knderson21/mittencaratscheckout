/* eslint-disable max-len */
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import styles from "./styles.module.scss";

const Login = ({ token, setToken }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // console.log('tokenResponse:', tokenResponse);
      // console.log('scope:', tokenResponse.scope);
      setToken(tokenResponse.access_token);
    },
    scope: "https://www.googleapis.com/auth/spreadsheets",
  });

  const logout = () => {
    googleLogout();
    setToken("");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.login}>
        <h1>Login</h1>
        {token ? (
          <>
            <div>You are logged in :3</div>
            <button className={styles.loginButton} onClick={logout}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <div>No log in token</div>
            <button className={styles.loginButton} onClick={login}>
              Sign in with Google
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
