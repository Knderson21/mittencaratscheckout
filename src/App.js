// App.js is the top-level orchestrator for this application.
//
// Responsibilities:
//   1. Hold the Google OAuth token in state (single source of truth for auth)
//   2. Instantiate all three business-logic hooks and compose their state
//   3. Act as an auth gate — render Login for all routes when no token is present
//   4. Pass state and setters down to child components via props (no Context API)
import {useEffect, useState} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import Login from './components/pages/Login';
import {Header, Store} from './components/pages';
import useCart from './hooks/useCart';
import useOrderForm from './hooks/useOrderForm';
import useCheckout from './hooks/useCheckout';

import './App.scss';

const App = () => {
  // token is the raw Google OAuth access token string ('' when logged out).
  // It gates the entire authenticated UI and is passed to useCheckout for
  // authorizing Sheets API calls.
  const [token, setToken] = useState('');

  // useNavigate returns a function that programmatically redirects the user.
  // It is passed to useCheckout so it can redirect to '/' on token expiry.
  const navigate = useNavigate();

  // useCart manages the product catalog, cart quantities, and total price.
  // isReady is false until both inventory and cart are initialized — it
  // prevents a flash of empty UI before data loads from localStorage.
  const {items, cart, setCart, totalPrice, isReady} = useCart();

  // useOrderForm manages the payment method, cashier name (reference), and
  // notes fields. All three are persisted in localStorage automatically.
  const orderForm = useOrderForm();

  // useCheckout owns the full checkout flow: token validation, building the
  // Sheets row, calling the API, and resetting state on success.
  // It needs access to both cart and form state so it can read them at
  // checkout time and reset them after a successful order.
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

  // On mount, restore the auth token from localStorage so the user does not
  // have to re-login after a page refresh.
  // The empty dependency array [] means this runs exactly once after the
  // first render — equivalent to componentDidMount in class components.
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) setToken(storedToken);
  }, []);

  // Block rendering until inventory and cart are both loaded from localStorage.
  // Without this guard, children would receive empty objects on first render
  // and briefly show an empty store.
  if (!isReady) {
    return null;
  }

  // Auth gate: if no token, show Login regardless of the current URL path.
  // The "/*" wildcard catches all routes so deep-links also show Login.
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

  // When authenticated, render the nav header and the full route tree.
  // All state and setters are passed as explicit props ("props drilling").
  // This is intentional — the app is small enough that Context API would
  // add complexity without benefit.
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
          {/* /settings reuses the Login component so staff can refresh an expired token */}
          <Route
            path='/settings'
            exact='true'
            element={<Login token={token} setToken={setToken} />}
          />
          {/* /test is a placeholder route, not a real test page */}
          <Route path='/test' element={<div>Test</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
