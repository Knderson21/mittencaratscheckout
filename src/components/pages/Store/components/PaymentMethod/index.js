import styles from './styles.module.scss';

const PaymentMethod = ({
  notes,
  paymentMethod,
  reference,
  setPaymentMethod,
  setNotes,
  setReference,
}) => {
  const radioClassName = (paymentMethod, value) => {
    if (paymentMethod === value) {
      return [styles.radio, styles.activeRadio].join(' ');
    } else {
      return styles.radio;
    }
  };

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
      </form>
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

export default PaymentMethod;
