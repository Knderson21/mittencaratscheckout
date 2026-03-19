import styles from './styles.module.scss';

// Product renders a single product tile with its image, name, price, and
// quantity controls (+/- buttons and a direct number input).
//
// Props:
//   product  - { id, name, price } — single item from the catalog
//   cart     - the full cart map (needed to read and update this item's qty)
//   setCart  - setter from useCart — replaces the entire cart object
const Product = ({cart, product, setCart}) => {
  const id = product.id;
  const quantity = cart[id] || 0;

  // Decrement quantity, clamped to 0 (no negative quantities).
  // The unary + before quantity coerces it to a number in case it was
  // stored as a string (direct input can produce strings).
  const subtract = () => {
    setCart({
      ...cart,
      [id]: quantity - 1 < 0 ? 0 : +quantity - 1,
    });
  };

  // Increment quantity. The unary + coerces quantity to a number.
  const add = () => {
    setCart({
      ...cart,
      [id]: +quantity + 1,
    });
  };

  // Handle direct numeric input. Strips minus signs to prevent negatives.
  // Temporarily allows an empty string so the user can clear the field before
  // typing a new number — onBlur handles the empty→0 conversion.
  const updateQuantity = (event) => {
    const value = event.target.value.replace('-', '');

    setCart({
      ...cart,
      [id]: value === '' ? '' :+value,
    });
  };

  // If the user clears the input and clicks away without entering a number,
  // default back to 0 rather than leaving an empty string in the cart.
  const handleBlur = () => {
    if (cart[id] === '') {
      setCart({
        ...cart,
        [id]: 0,
      });
    }
  };

  return (
    <div className={styles.product}>
      {/* Product image is loaded from /public/images/image{id}.png.
          process.env.PUBLIC_URL ensures the path is correct on GitHub Pages
          where the app may be served from a subdirectory. */}
      <img
        className={styles.image}
        src={`${process.env.PUBLIC_URL}/images/image${id}.png`}
        alt={product.name}
      />
      <h3>{product.name} (${product.price})</h3>
      <div className={styles.quantityContainer}>
        <button className={styles.subtract} onClick={subtract}>-</button>
        <input
          type="number"
          value={cart[id]}
          onChange={updateQuantity}
          onBlur={handleBlur}
          name={`product-quantity-${id}`}
        />
        <button className={styles.add} onClick={add}>+</button>
      </div>
    </div>
  );
};

export default Product;
