import {Cart, Inventory} from './components';
import styles from './styles.module.scss';

// Returns the CSS class string for a payment method radio button label.
// Combines the base `radio` style with `activeRadio` when this option
// is selected.
const radioClassName = (paymentMethod, value) => {
  if (paymentMethod === value) {
    return [styles.radio, styles.activeRadio].join(' ');
  } else {
    return styles.radio;
  }
};

// PaymentMethod renders the payment type selector (radio buttons) and the
// cashier name / notes text inputs.
//
// All inputs are "controlled" — React owns the state (via props), and every
// change calls a setter to push the new value back up to App.js. This is
// the opposite of uncontrolled inputs where the DOM holds the value.
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
      {/* Radio group — `checked` is driven by the paymentMethod prop,
          and onChange calls the setter passed down from App.js */}
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
          className={radioClassName(paymentMethod, 'apple cash')}
        >
          <input
            type="radio"
            name="payment"
            value="apple cash"
            checked={paymentMethod === 'apple cash'}
            onChange={() => setPaymentMethod('apple cash')}
          />
          AppleCash
        </label>
        <label
          className={radioClassName(paymentMethod, 'cash app')}
        >
          <input
            type="radio"
            name="payment"
            value="cash app"
            checked={paymentMethod === 'cash app'}
            onChange={() => setPaymentMethod('cash app')}
          />
          CashApp
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
        <label className={radioClassName(paymentMethod, 'micah')}>
          <input
            type="radio"
            name="payment"
            value="micah"
            checked={paymentMethod === 'micah'}
            onChange={() => setPaymentMethod('micah')}
          />
          Micah
        </label>
      </form>
      {/* Controlled text inputs — value is driven by props, onChange pushes
          the typed string back up to App.js via the setter */}
      <div className={styles.inputWrapper}>
        <textarea
          type="text"
          rows="1"
          name="reference"
          placeholder="Cashier (Your Name)"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
        />
        <textarea
          className={styles.notesInput}
          rows="2"
          type="text"
          name="notes"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>
    </div>
  );
};

// Checkout renders the action buttons fixed at the bottom of the page.
// Both buttons are disabled while the Sheets API call is in-flight (loading).
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

// Store is the main page component. It composes Cart, Inventory, PaymentMethod,
// and Checkout, and owns the clearCart action (manual cancel by the cashier).
const Store = ({
  cart,
  notes,
  items,
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
  // Safety guard — shouldn't be reached due to the isReady check in App.js,
  // but prevents a crash if items or cart are ever undefined.
  if (!items || !cart) {
    return null;
  }

  // clearCart resets all quantities to 0 and clears the form fields.
  // This is the manual "cancel" flow — separate from the post-checkout reset
  // that lives in useCheckout, though they produce the same end state.
  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear cart?')) {
      const newCart = {};
      Object.keys(items).forEach((key) => {
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
      {/* Scrollable content area containing the cart summary, product grid,
          and payment/notes form */}
      <div className={styles.inventoryContainer}>
        <Cart cart={cart} items={items} totalPrice={totalPrice} />
        <Inventory items={items} cart={cart} setCart={setCart} />
        <PaymentMethod
          notes={notes}
          paymentMethod={paymentMethod}
          reference={reference}
          setNotes={setNotes}
          setPaymentMethod={setPaymentMethod}
          setReference={setReference}
        />
      </div>
      {/* Fixed footer bar with Cancel and Checkout buttons */}
      <Checkout
        clearCart={clearCart}
        appendSheetData={appendSheetData}
        loading={loading}
      />
    </div>
  );
};

export default Store;
