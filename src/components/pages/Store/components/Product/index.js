import styles from './styles.module.scss';

const Product = ({cart, product, setCart}) => {
  const id = product.id;
  const quantity = cart[id] || 0;

  const subtract = () => {
    setCart({
      ...cart,
      [id]: quantity - 1 < 0 ? 0 : +quantity - 1,
    });
  };

  const add = () => {
    setCart({
      ...cart,
      [id]: +quantity + 1,
    });
  };

  const updateQuantity = (event) => {
    const value = event.target.value.replace('-', '');

    setCart({
      ...cart,
      [id]: value === '' ? '' :+value,
    });
  };

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
      {/* <img className={styles.image} src={image1} alt={product.name} /> */}
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
