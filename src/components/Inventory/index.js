import Potion from "../Potion";
import styles from "./styles.module.scss";

const Inventory = ({ cart, potions, setCart }) => {
  return (
    <div className={styles.inventoryContainer}>
      <div className={styles.inventory}>
        {Object.keys(potions).map((key) => {
          const potion = potions[key];
          return (
            <Potion
              potion={potion}
              key={potion.name}
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
