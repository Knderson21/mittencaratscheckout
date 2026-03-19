import {useEffect, useState} from 'react';
import storedInventory from '../constants/inventory.json';

const useCart = () => {
  const [inventory, setInventory] = useState({});
  const [cart, setCart] = useState({});

  // Load inventory on mount
  useEffect(() => {
    setInventory({...storedInventory});
  }, []);

  // Initialize cart from localStorage, or build from inventory keys
  useEffect(() => {
    if (Object.keys(inventory).length === 0) return;

    const storedCart = JSON.parse(localStorage.getItem('cart'));
    if (storedCart) {
      setCart(storedCart);
      return;
    }

    const newCart = {};
    Object.keys(inventory.items).forEach((key) => {
      newCart[key] = 0;
    });
    setCart(newCart);
  }, [inventory]);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(cart).length === 0) return;
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const items = inventory.items || {};

  let totalPrice = 0;
  Object.keys(cart).forEach((key) => {
    if (items[key]) totalPrice += items[key].price * cart[key];
  });
  totalPrice = totalPrice.toFixed(2);

  const isReady =
    Object.keys(inventory).length > 0 && Object.keys(cart).length > 0;

  return {items, cart, setCart, totalPrice, isReady};
};

export default useCart;
