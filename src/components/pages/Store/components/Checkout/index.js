import styles from './styles.module.scss';

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

export default Checkout;
