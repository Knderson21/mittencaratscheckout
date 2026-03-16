import Product from '../Product';
import styles from './styles.module.scss';

const Inventory = ({cart, items, setCart}) => {
  return (
    <div className={styles.inventoryContainer}>
      <div className={styles.inventory}>
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
