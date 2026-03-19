import styles from './styles.module.scss';

// Cart shows a read-only summary of items currently in the cart and the
// running total. Quantity changes happen in the Product component, not here.
//
// Props:
//   cart       - { [productId]: quantity } — the full cart map from useCart
//   items      - { [productId]: { name, price, id } } — the product catalog
//   totalPrice - formatted string, e.g. "14.00" (no $ sign; $ added in JSX)
const Cart = ({cart, items, totalPrice}) => {
  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartList}>
        <p>In Cart:</p>
        <ul>
          {/* Iterate all product IDs; skip those with a quantity of 0.
              React requires a unique `key` prop on each list item — here we
              use the product ID since it's already unique. */}
          {Object.keys(cart).map((key) => {
            if (!cart[key]) {
              return null;
            }
            return (
              <li key={key}>
                {cart[key]} x {items[key].name}
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.cartTotal}>
        <h1>Total:</h1>
        <h2>${totalPrice}</h2>
      </div>
    </div>
  );
};

export default Cart;
