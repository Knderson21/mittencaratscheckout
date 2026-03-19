import {useEffect, useState} from 'react';
import storedInventory from '../constants/inventory.json';

// useCart manages the product catalog and cart state.
//
// The cart is a flat map of { [productId]: quantity } where every product ID
// always has an entry (quantity = 0 means "not in cart"). This consistent shape
// means components can iterate all products without null checks.
const useCart = () => {
  const [inventory, setInventory] = useState({});
  const [cart, setCart] = useState({});

  // Load inventory from the bundled JSON file on mount.
  // useEffect with [] runs exactly once after the first render,
  // similar to componentDidMount in class components.
  useEffect(() => {
    setInventory({...storedInventory});
  }, []);

  // Once inventory is loaded, initialize the cart.
  // [inventory] in the dependency array means this effect re-runs whenever
  // inventory changes. The early return guards against running before inventory
  // has loaded (when it's still an empty object).
  useEffect(() => {
    if (Object.keys(inventory).length === 0) return;

    // If a cart was saved in a previous session, restore it.
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    if (storedCart) {
      setCart(storedCart);
      return;
    }

    // Otherwise build a fresh cart with every product set to quantity 0.
    const newCart = {};
    Object.keys(inventory.items).forEach((key) => {
      newCart[key] = 0;
    });
    setCart(newCart);
  }, [inventory]);

  // Sync cart to localStorage whenever quantities change.
  // The early return skips the sync while the cart is still being initialized
  // (empty object), which prevents clobbering a stored cart with {}.
  useEffect(() => {
    if (Object.keys(cart).length === 0) return;
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Expose inventory.items as a flat map for easier use in child components.
  // Falls back to {} before inventory loads.
  const items = inventory.items || {};

  // Calculate the running total across all cart items.
  let totalPrice = 0;
  Object.keys(cart).forEach((key) => {
    if (items[key]) totalPrice += items[key].price * cart[key];
  });
  totalPrice = totalPrice.toFixed(2); // Format as "14.00" (no $ sign)

  // isReady is true only once both inventory and cart are populated.
  // App.js renders null until this is true to prevent empty-state flicker.
  const isReady =
    Object.keys(inventory).length > 0 && Object.keys(cart).length > 0;

  return {items, cart, setCart, totalPrice, isReady};
};

export default useCart;
