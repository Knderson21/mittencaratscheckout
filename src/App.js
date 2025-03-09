/* eslint-disable max-len */
import {useEffect, useState} from 'react';
import {Routes, Route} from 'react-router-dom';
import {Login, Header, Store} from './pages';
import storedInventory from './constants/inventory.json';
import './App.scss';

const App = () => {
  const [token, setToken] = useState('');
  const [inventory, setInventory] = useState({});
  const [cart, setCart] = useState({});
  const [sheetId] = useState(process.env.SHEET_ID);
  const [sheetName] = useState(process.env.SHEET_NAME);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInventory({...storedInventory});
    const storedPaymentMethod = localStorage.getItem('potionPaymentMethod');
    const storedNotes = localStorage.getItem('potionNotes');
    const storedReference = localStorage.getItem('potionReference');
    const storedToken = localStorage.getItem('potionToken');

    if (storedPaymentMethod) setPaymentMethod(storedPaymentMethod);
    if (storedNotes) setNotes(storedNotes);
    if (storedReference) setReference(storedReference);
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (Object.keys(cart).length === 0) return;
    localStorage.setItem('potionCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('potionPaymentMethod', paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    localStorage.setItem('potionNotes', notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('potionReference', reference);
  }, [reference]);

  useEffect(() => {
    localStorage.setItem('potionToken', token);
  }, [token]);


  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('potionCart'));
    if (storedCart) {
      setCart(storedCart);
      return;
    }
    // set cart to have all keys to 0
    if (Object.keys(inventory).length > 0) {
      const newCart = {};
      Object.keys(inventory.items).forEach((key) => {
        newCart[key] = 0;
      });
      setCart(newCart);
    }
  }, [inventory]);

  if (Object.keys(inventory).length === 0) {
    return null;
  }

  if (Object.keys(cart).length === 0) {
    return null;
  }

  const potions = inventory.items;
  let totalPrice = 0;
  Object.keys(cart).forEach((key) => {
    totalPrice += potions[key].price * cart[key];
  });

  totalPrice = totalPrice.toFixed(2);

  if (!token) {
    return (
        <Routes>
          <Route
            path="/login"
            element={<Login
              token={token}
              setToken={setToken}
            />}
          />
        </Routes>
    );
  }

  const appendSheetData = () => {
    const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`;

    if (!window.confirm('Are you sure you want to checkout?')) {
      return;
    }

    const date = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true, // Set to false if you want 24-hour time format
    });

    const values = [date, reference];

    let totalQuantity = 0;
    Object.keys(cart).forEach((key) => {
      totalQuantity += cart[key];
      values.push(`$${(potions[key].price * cart[key]).toFixed(2)}`);
      values.push(cart[key]);
    });

    if (totalQuantity === 0) {
      window.alert('Cart is empty!');
      return;
    }

    values.push(paymentMethod, `$${totalPrice}`, notes);

    const body = {
      values: [values],
    };
    setLoading(true);
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
            setLoading(false);
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          console.log('Clearing cart after successful response:', data);
          const newCart = {};
          Object.keys(potions).forEach((key) => {
            newCart[key] = 0;
          });
          setCart(newCart);
          setPaymentMethod('cash');
          setReference('');
          setNotes('');
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error appending data:', error);
          setToken('');
          setLoading(false);
        });
  };

  return (
    <div className="appContainer">
        <div className="pageContainer">
          <Header />
          <Routes>
            <Route
              path='/'
              exact='true'
              element={
                <Store
                  potions={potions}
                  cart={cart}
                  notes={notes}
                  paymentMethod={paymentMethod}
                  reference={reference}
                  setCart={setCart}
                  setNotes={setNotes}
                  setPaymentMethod={setPaymentMethod}
                  setReference={setReference}
                  appendSheetData={appendSheetData}
                  totalPrice={totalPrice}
                  loading={loading}
                />
              }
            />
            <Route
              path='/login'
              exact='true'
              element={<Login token={token} setToken={setToken} />}
            />
          </Routes>
        </div>
    </div>
  );
};

export default App;
