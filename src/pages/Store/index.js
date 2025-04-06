import { Cart, Inventory, Checkout, PaymentMethod } from "../../components";
import { useAppContext } from "../../utils/appContext";
import styles from "./styles.module.scss";

const Store = ({
  cart,
  notes,
  potions,
  setCart,
  setNotes,
  setReference,
  totalPrice,
  loading,
}) => {
  const { reference, paymentMethod, setReference, setPaymentMethod } = useAppContext();

  if (!potions || !cart) {
    return null;
  }
  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear cart?")) {
      const newCart = {};
      Object.keys(potions).forEach((key) => {
        newCart[key] = 0;
      });
      setCart(newCart);
      setPaymentMethod("cash");
      setReference("");
      setNotes("");
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
        loading={loading}
      />
    </div>
  );
};

export default Store;
