/* eslint-disable max-len */
import {useGoogleLogin} from '@react-oauth/google';
import styles from './styles.module.scss';

const Login = ({
  cart,
  potions,
  sheetId,
  sheetName,
  token,
  setToken,
  setSheetId,
  setSheetName,
}) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // console.log('tokenResponse:', tokenResponse);
      // console.log('scope:', tokenResponse.scope);
      setToken(tokenResponse.access_token);
    },
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const insertTitleRow = () => {
    const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`;
    if (!token) {
      console.log('no token!');
      return;
    }

    const values = ['Timestamp', 'Reference'];

    // iterate through inventory, for each item, push the name, then string 'Quantity' to the values array
    Object.keys(potions).forEach((key) => {
      values.push(potions[key].name, 'Quantity');
    });

    values.push('Payment Method', 'Total', 'Notes');

    const body = {
      values: [values],
    };


    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
        .then((response) => {
          if (!response.ok) {
            setToken('');
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Append response:', data);
        })
        .catch((error) => {
          setToken('');
          console.error('Error appending data:', error);
        });
  };

  const appendSheetData = () => {
    const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`;
    if (!token) {
      console.log('no token!');
      return;
    }

    const body = {
      values: [
        ['Data 1', 'Data 2', 'Data 3', 'Data 4', 'Data 5', 'Paypal'], // Data to append
      ],
    };
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
        .then((response) => {
          if (!response.ok) {
            setToken('');
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Append response:', data);
        })
        .catch((error) => {
          console.error('Error appending data:', error);
          setToken('');
        });
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.login}>
        <h1>Settings</h1>
        <div> Sheet ID: </div>
        <input
          value={sheetId}
          onChange={(e) => setSheetId(e.target.value)}
          name="sheetId"
        />
        <div> Sheet Name:</div>
        <input
          value={sheetName}
          onChange={(e) => setSheetName(e.target.value)}
          name="sheetName"
        />
        {token ? (
          <div>Log in token present</div>
        ): (
          <div>No log in token</div>
        )}
        <button className={styles.loginButton} onClick={() => login()}>Sign in with Google</button>
        <hr />
        <button onClick={appendSheetData} disabled={!token}>
          Append Dummy Row Test
        </button>
        <button onClick={insertTitleRow} disabled={!token}>
          Insert Title Row
        </button>
      </div>
    </div>
  );
};

export default Login;
