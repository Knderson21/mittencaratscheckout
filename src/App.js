/* eslint-disable max-len */
import {useEffect, useState} from 'react';
import {Routes, Route, HashRouter} from 'react-router-dom';
import {Login, Header, Store} from './components/pages';
import storedInventory from './constants/inventory.json';

import './App.scss';

const App = () => {
  const [token, setToken] = useState('');
  const [inventory, setInventory] = useState({});
  const [cart, setCart] = useState({});
  const [sheetId, setSheetId] = useState('');
  const [sheetName, setSheetName] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(false);

  const basename = '/';
  // const basename = process.env.NODE_ENV === 'production' ? '/' : '';
  // const basename = process.env.NODE_ENV === 'production' ? process.env.PUBLIC_URL : '';

  useEffect(() => {
    setInventory({...storedInventory});
    const storedSheetId = localStorage.getItem('potionSheetId');
    const storedSheetName = localStorage.getItem('potionSheetName');
    const storedPaymentMethod = localStorage.getItem('potionPaymentMethod');
    const storedNotes = localStorage.getItem('potionNotes');
    const storedReference = localStorage.getItem('potionReference');
    const storedToken = localStorage.getItem('potionToken');

    // console.log('storedSheetId', storedSheetId, typeof storedSheetId);
    // console.log('storedSheetName', storedSheetName, typeof storedSheetName);
    // console.log('storedPaymentMethod', storedPaymentMethod, typeof storedPaymentMethod);

    if (storedSheetId) setSheetId(storedSheetId);
    if (storedSheetName) setSheetName(storedSheetName);
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
    localStorage.setItem('potionSheetId', sheetId);
  }, [sheetId]);

  useEffect(() => {
    localStorage.setItem('potionSheetName', sheetName);
  }, [sheetName]);

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
      <HashRouter basename={basename}>
        <Routes>
          <Route
            path="/*"
            element={<Login
              potions={potions}
              cart={cart}
              token={token}
              sheetId={sheetId}
              sheetName={sheetName}
              setCart={setCart}
              setToken={setToken}
              setSheetId={setSheetId}
              setSheetName={setSheetName}
            />}
          />
        </Routes>
      </HashRouter>
    );
  }

  const appendSheetData = () => {
    const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`;

    if (!window.confirm('Are you sure you want to checkout?')) {
      return;
    }

    const timestamp = new Date();
    const date = timestamp.toLocaleString('en-US', {
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
            // if (response.status === 401) {
            //   setToken('');
            //   throw new Error('Unauthorized access - possibly invalid token');
            // }
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
    <div
      className="appContainer"
    >
      <HashRouter basename={basename}>
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
              path='/settings'
              exact='true'
              element={
                <Login
                  potions={potions}
                  cart={cart}
                  token={token}
                  sheetId={sheetId}
                  sheetName={sheetName}
                  setCart={setCart}
                  setToken={setToken}
                  setSheetId={setSheetId}
                  setSheetName={setSheetName}
                />}
            />
            <Route path='/test' element={<div>Test</div>} />
          </Routes>
        </div>
      </HashRouter>
    </div>
  );
};

export default App;
