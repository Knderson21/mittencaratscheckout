import Product from '../Product';
import styles from './styles.module.scss';

// Inventory renders the horizontally scrollable product grid.
// It maps over the items catalog and renders one Product tile per item.
//
// Props:
//   items   - { [productId]: { name, price, id } } — the full product catalog
//   cart    - { [productId]: quantity } — passed through to each Product tile
//   setCart - setter from useCart — passed through so Product can update quantities
const Inventory = ({cart, items, setCart}) => {
  return (
    <div className={styles.inventoryContainer}>
      <div className={styles.inventory}>
        {/* React requires a unique `key` prop when rendering lists.
            We use product.name here since product IDs are also unique and
            stable, but name works equally well as a key. */}
        {Object.keys(items).map((key) => {
          const product = items[key];
          return (
            <Product
              product={product}
              key={product.name}
              cart={cart}
              setCart={setCart}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Inventory;
