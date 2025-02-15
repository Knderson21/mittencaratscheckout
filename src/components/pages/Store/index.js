import {Cart, Inventory} from './components';
import styles from './styles.module.scss';

const radioClassName = (paymentMethod, value) => {
  if (paymentMethod === value) {
    return [styles.radio, styles.activeRadio].join(' ');
  } else {
    return styles.radio;
  }
};
const PaymentMethod = ({
  notes,
  paymentMethod,
  reference,
  setPaymentMethod,
  setNotes,
  setReference,
}) => {
  return (
    <div className={styles.paymentMethodContainer}>
      <form>
        <label
          className={radioClassName(paymentMethod, 'cash')}
        >
          <input
            type="radio"
            name="payment"
            value="cash"
            checked={paymentMethod === 'cash'}
            onChange={() => setPaymentMethod('cash')}
          />
        Cash
        </label>

        <label
          className={radioClassName(paymentMethod, 'paypal')}
        >
          <input
            type="radio"
            name="payment"
            value="paypal"
            checked={paymentMethod === 'paypal'}
            onChange={() => setPaymentMethod('paypal')}
          />
        Paypal
        </label>

        <label
          className={radioClassName(paymentMethod, 'venmo')}
        >
          <input
            type="radio"
            name="payment"
            value="venmo"
            checked={paymentMethod === 'venmo'}
            onChange={() => setPaymentMethod('venmo')}
          />
        Venmo
        </label>

        <label
          className={radioClassName(paymentMethod, 'zelle')}
        >
          <input
            type="radio"
            name="payment"
            value="zelle"
            checked={paymentMethod === 'zelle'}
            onChange={() => setPaymentMethod('zelle')}
          />
        Zelle
        </label>
      </form>
      <div className={styles.inputWrapper}>
        <textarea
          type="text"
          rows="1"
          name="reference"
          placeholder="Reference"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
        />
        <textarea
          className={styles.notesInput}
          rows="2"
          type="text"
          name="notes"
          placeholder="Notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>
    </div>
  );
};

const Checkout = ({appendSheetData, clearCart, loading}) => {
  return (
    <div className={styles.checkoutContainer}>
      <button
        className={styles.cancel}
        onClick={clearCart}
        disabled={loading}
      >Cancel / Clear Cart
      </button>
      <button
        className={styles.checkout}
        onClick={appendSheetData}
        disabled={loading}
      >Checkout
      </button>
    </div>
  );
};

const Store = ({
  cart,
  notes,
  potions,
  paymentMethod,
  reference,
  setCart,
  appendSheetData,
  setNotes,
  setPaymentMethod,
  setReference,
  totalPrice,
  loading,
}) => {
  if (!potions || !cart) {
    return null;
  }
  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear cart?')) {
      const newCart = {};
      Object.keys(potions).forEach((key) => {
        newCart[key] = 0;
      });
      setCart(newCart);
      setPaymentMethod('cash');
      setReference('');
      setNotes('');
    }
  };

  return (
    <div className={styles.storeContainer}>
      <div className={styles.inventoryContainer}>
        <Cart cart={cart} potions={potions} totalPrice={totalPrice} />
        <Inventory potions={potions} cart={cart} setCart={setCart} />
        <PaymentMethod
          notes={notes}
          paymentMethod={paymentMethod}
          reference={reference}
          setNotes={setNotes}
          setPaymentMethod={setPaymentMethod}
          setReference={setReference}
        />
      </div>
      <Checkout
        clearCart={clearCart}
        appendSheetData={appendSheetData}
        loading={loading}
      />
    </div>
  );
};

export default Store;
