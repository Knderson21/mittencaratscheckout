import styles from './styles.module.scss';

// Product renders a single product tile with its image, name, price, and
// quantity controls (+/- buttons and a direct number input).
//
// Props:
//   product  - { id, name, price, stock?, image? } — single item from catalog
//              stock: null/undefined = unlimited; number = tracked quantity
//              image: base64 data URL from admin upload; falls back to
//              /public/images/image{id}.png
//   cart     - the full cart map (needed to read and update this item's qty)
//   setCart  - setter from useCart — replaces the entire cart object
const Product = ({cart, product, setCart}) => {
  const id = product.id;
  const quantity = cart[id] || 0;
  const hasStock = product.stock !== null && product.stock !== undefined;
  const atStockLimit = hasStock && +quantity >= product.stock;
  const outOfStock = hasStock && product.stock === 0;

  // Decrement quantity, clamped to 0 (no negative quantities).
  // The unary + before quantity coerces it to a number in case it was
  // stored as a string (direct input can produce strings).
  const subtract = () => {
    setCart({
      ...cart,
      [id]: quantity - 1 < 0 ? 0 : +quantity - 1,
    });
  };

  // Increment quantity, clamped to available stock when stock is tracked.
  // The unary + coerces quantity to a number.
  const add = () => {
    if (atStockLimit) return;
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
    const numValue = value === '' ? '' : +value;
    // Clamp to available stock when stock is tracked.
    const clamped = hasStock && numValue !== '' && numValue > product.stock ?
      product.stock : numValue;
    setCart({
      ...cart,
      [id]: clamped,
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

  // Use the admin-uploaded image if present; otherwise fall back to the
  // static image file in /public/images/.
  const imgSrc = product.image ||
    `${process.env.PUBLIC_URL}/images/image${id}.png`;

  return (
    <div className={`${styles.product} ${outOfStock ? styles.outOfStock : ''}`}>
      <img
        className={styles.image}
        src={imgSrc}
        alt={product.name}
      />
      {hasStock && (
        <span className={
          `${styles.stockBadge} ${outOfStock ? styles.stockBadgeEmpty : ''}`
        }>
          {outOfStock ? 'Out of stock' : `${product.stock} left`}
        </span>
      )}
      <h3>{product.name} (${product.price})</h3>
      <div className={styles.quantityContainer}>
        <button className={styles.subtract} onClick={subtract}>-</button>
        <input
          type="number"
          value={cart[id]}
          onChange={updateQuantity}
          onBlur={handleBlur}
          name={`product-quantity-${id}`}
          disabled={outOfStock}
        />
        <button
          className={styles.add}
          onClick={add}
          disabled={atStockLimit}
        >+</button>
      </div>
    </div>
  );
};

export default Product;
