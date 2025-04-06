import styles from "./styles.module.scss";
import { date } from "./utils/tools";
import { saveCart } from "./services/apiService";

const Checkout = ({ clearCart, loading }) => {
  return (
    <div className={styles.checkoutContainer}>
      <button className={styles.cancel} onClick={clearCart} disabled={loading}>
        Clear Cart
      </button>
      <button
        className={styles.checkout}
        onClick={appendSheetData}
        disabled={loading}
      >
        Checkout
      </button>
    </div>
  );
};

export default Checkout;

const appendSheetData = async () => {
  if (!window.confirm("Are you sure you want to checkout?")) {
    return;
  }

  const values = [date, reference];

  let totalQuantity = 0;
  Object.keys(cart).forEach((key) => {
    totalQuantity += cart[key];
    values.push(`$${(inventory.items[key].price * cart[key]).toFixed(2)}`);
    values.push(cart[key]);
  });

  if (totalQuantity === 0) {
    window.alert("Cart is empty!");
    return;
  }

  values.push(paymentMethod, `$${totalPrice}`, notes);

  const body = {
    values: [values],
  };

  await saveCart(body);

  console.log("Clearing cart after successful response:", data);
  const newCart = {};
  Object.keys(inventory.items).forEach((key) => {
    newCart[key] = 0;
  });
  setCart(newCart);
  setPaymentMethod("cash");
  setReference("");
  setNotes("");
  setLoading(false);
};
