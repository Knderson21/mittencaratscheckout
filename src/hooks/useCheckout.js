import {useState} from 'react';
import {getWithExpiry} from '../components/pages/Login';
import postOrder from '../services/sheetsApi';

/**
 * Manages the checkout flow — the only place in the app that calls
 * the Sheets API.
 *
 * Parameters are passed from App.js because useCheckout needs to read cart
 * and form state at submit time, and reset them after a successful order.
 *
 * @param {object} params
 * @param {string} params.token - Google OAuth access token used to
 *   authorize the Sheets request
 * @param {function(string): void} params.setToken - Setter to clear
 *   the token on auth failure
 * @param {object} params.items - Product catalog keyed by product ID
 * @param {object} params.cart - Current cart quantities keyed by product ID
 * @param {function(object): void} params.setCart - Setter to reset the
 *   cart after checkout
 * @param {string} params.totalPrice - Formatted total, e.g. "14.00"
 * @param {object} params.orderForm - The orderForm object from useOrderForm
 * @param {function(string): void} params.navigate - React Router navigate
 *   function for redirects
 * @return {object} appendSheetData function and loading boolean
 */
const useCheckout = ({
  token, setToken, items, cart, setCart, totalPrice, orderForm, navigate,
}) => {
  // loading is true while the Sheets API request is in-flight.
  // It is passed to the Checkout button to show a disabled/loading state
  // and prevent double-submits.
  const [loading, setLoading] = useState(false);

  // These env vars are injected at build time by GitHub Actions (CI only).
  // For local dev, add them to your .env file. See CLAUDE.md for details.
  const sheetId = process.env.REACT_APP_SHEET_ID;
  const sheetName = process.env.REACT_APP_SHEET_NAME;

  // appendSheetData is the checkout handler. Steps:
  //   1. Verify the auth token has not expired
  //   2. Ask the cashier to confirm
  //   3. Build the order row (positional array matching the Sheet's columns)
  //   4. Guard against an empty cart
  //   5. POST to Google Sheets
  //   6. On success: reset cart and form
  //   7. On failure: clear token (forces re-login) and log the error
  const appendSheetData = () => {
    // Step 1: Check token expiry. getWithExpiry parses the stored token and
    // returns null if it has expired. If expired, clear the in-memory token
    // and redirect to the login screen.
    if (!getWithExpiry('authToken')) {
      // eslint-disable-next-line max-len
      window.alert('Auth token is invalid! Please resign in with Google to continue checkout.');
      setToken('');
      navigate('/');
      return;
    }

    // Step 2: Confirm with the cashier before submitting.
    if (!window.confirm('Are you sure you want to checkout?')) {
      return;
    }

    // Step 3: Build the order row. The row is a positional array — the column
    // order in Google Sheets must match the push order here.
    // Format: "3/19/2025, 10:30 AM"
    const date = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    // Row starts with date and cashier name, followed by repeating item pairs.
    const values = [date, orderForm.reference];

    // For each product, push the line-item total and quantity.
    // Note: this iterates ALL products (including 0-qty ones), which pushes
    // "$0.00" and 0 into the row for items not in the cart. This is a known
    // bug — columns still align with the Sheet because every order pushes the
    // same number of values regardless of what's in the cart.
    let totalQuantity = 0;
    Object.keys(cart).forEach((key) => {
      totalQuantity += cart[key];
      values.push(`$${(items[key].price * cart[key]).toFixed(2)}`);
      values.push(cart[key]);
    });

    // Step 4: Guard against an empty cart.
    if (totalQuantity === 0) {
      window.alert('Cart is empty!');
      return;
    }

    // Append order metadata at the end of the row.
    values.push(orderForm.paymentMethod, `$${totalPrice}`, orderForm.notes);

    // Step 5: POST to Google Sheets. setLoading(true) disables the button
    // to prevent double-submits while the request is in-flight.
    setLoading(true);
    postOrder(token, sheetId, sheetName, values)
        .then((response) => {
          // A non-ok response (e.g. 401 Unauthorized) means the token was
          // rejected by Google. Clear it so the user is forced to re-login.
          if (!response.ok) {
            setToken('');
            setLoading(false);
            throw new Error(
                'Network response was not ok ' + response.statusText,
            );
          }
          return response.json();
        })
        .then((data) => {
          // Step 6: Success — reset cart to all-zero quantities and clear form.
          console.log('Clearing cart after successful response:', data);
          const newCart = {};
          Object.keys(items).forEach((key) => {
            newCart[key] = 0;
          });
          setCart(newCart);
          orderForm.resetForm();
          setLoading(false);
        })
        .catch((error) => {
          // Step 7: Any error clears the token to force re-authentication.
          // The assumption is that most errors are auth-related (expired token,
          // revoked access). Check the browser network tab for the cause.
          console.error('Error appending data:', error);
          setToken('');
          setLoading(false);
        });
  };

  return {appendSheetData, loading};
};

export default useCheckout;
