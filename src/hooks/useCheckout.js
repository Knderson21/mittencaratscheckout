import {useState} from 'react';
import {getWithExpiry} from '../components/pages/Login';
import postOrder from '../services/sheetsApi';

const useCheckout = ({
  token, setToken, items, cart, setCart, totalPrice, orderForm, navigate,
}) => {
  const [loading, setLoading] = useState(false);

  const sheetId = process.env.REACT_APP_SHEET_ID;
  const sheetName = process.env.REACT_APP_SHEET_NAME;

  const appendSheetData = () => {
    if (!getWithExpiry('authToken')) {
      // eslint-disable-next-line max-len
      window.alert('Auth token is invalid! Please resign in with Google to continue checkout.');
      setToken('');
      navigate('/');
      return;
    }

    if (!window.confirm('Are you sure you want to checkout?')) {
      return;
    }

    const date = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const values = [date, orderForm.reference];

    let totalQuantity = 0;
    Object.keys(cart).forEach((key) => {
      totalQuantity += cart[key];
      values.push(`$${(items[key].price * cart[key]).toFixed(2)}`);
      values.push(cart[key]);
    });

    if (totalQuantity === 0) {
      window.alert('Cart is empty!');
      return;
    }

    values.push(orderForm.paymentMethod, `$${totalPrice}`, orderForm.notes);

    setLoading(true);
    postOrder(token, sheetId, sheetName, values)
        .then((response) => {
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
          console.error('Error appending data:', error);
          setToken('');
          setLoading(false);
        });
  };

  return {appendSheetData, loading};
};

export default useCheckout;
