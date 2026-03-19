import {useEffect, useState} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import Login from './components/pages/Login';
import {Header, Store} from './components/pages';
import useCart from './hooks/useCart';
import useOrderForm from './hooks/useOrderForm';
import useCheckout from './hooks/useCheckout';

import './App.scss';

const App = () => {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  const {items, cart, setCart, totalPrice, isReady} = useCart();
  const orderForm = useOrderForm();
  const {appendSheetData, loading} = useCheckout({
    token,
    setToken,
    items,
    cart,
    setCart,
    totalPrice,
    orderForm,
    navigate,
  });

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) setToken(storedToken);
  }, []);

  if (!isReady) {
    return null;
  }

  if (!token) {
    return (
      <Routes>
        <Route
          path="/*"
          element={<Login token={token} setToken={setToken} />}
        />
      </Routes>
    );
  }

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
                items={items}
                cart={cart}
                notes={orderForm.notes}
                paymentMethod={orderForm.paymentMethod}
                reference={orderForm.reference}
                setCart={setCart}
                setNotes={orderForm.setNotes}
                setPaymentMethod={orderForm.setPaymentMethod}
                setReference={orderForm.setReference}
                appendSheetData={appendSheetData}
                totalPrice={totalPrice}
                loading={loading}
              />
            }
          />
          <Route
            path='/settings'
            exact='true'
            element={<Login token={token} setToken={setToken} />}
          />
          <Route path='/test' element={<div>Test</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
