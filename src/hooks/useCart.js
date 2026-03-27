import {useEffect, useState} from 'react';
import storedInventory from '../constants/inventory.json';

// useCart manages the product catalog and cart state.
//
// The cart is a flat map of { [productId]: quantity } where every product ID
// always has an entry (quantity = 0 means "not in cart"). This consistent shape
// means components can iterate all products without null checks.
//
// adminInventory (localStorage key "adminInventory") stores runtime overrides:
// edited names/prices/images/stock counts, new products, and deletion markers.
// It is merged with the bundled JSON at render time — admin values win.
const useCart = () => {
  const [inventory, setInventory] = useState({});
  // adminInventory shape:
  //   { items: { [id]: { id, name, price, stock, image, _deleted? } } }
  // stock: null = unlimited, number = tracked. _deleted hides a bundled item.
  const [adminInventory, setAdminInventory] = useState({items: {}});
  const [cart, setCart] = useState({});

  // Load bundled inventory from JSON on mount.
  useEffect(() => {
    setInventory({...storedInventory});
  }, []);

  // Load admin inventory overrides from localStorage on mount.
  useEffect(() => {
    const stored = localStorage.getItem('adminInventory');
    if (stored) {
      setAdminInventory(JSON.parse(stored));
    }
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
    // Also include any admin-added products from localStorage.
    const newCart = {};
    Object.keys(inventory.items).forEach((key) => {
      newCart[key] = 0;
    });
    const storedAdmin = JSON.parse(
        localStorage.getItem('adminInventory') || '{"items":{}}',
    );
    Object.keys(storedAdmin.items).forEach((key) => {
      if (!storedAdmin.items[key]._deleted && !newCart[key]) {
        newCart[key] = 0;
      }
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

  // Merge bundled inventory with admin overrides.
  // Admin values (name, price, stock, image) take precedence over bundled.
  // Items marked _deleted are excluded from the visible catalog.
  const bundledItems = inventory.items || {};
  const adminItems = adminInventory.items || {};
  const mergedItems = {};
  Object.keys(bundledItems).forEach((key) => {
    mergedItems[key] = {...bundledItems[key], ...(adminItems[key] || {})};
  });
  Object.keys(adminItems).forEach((key) => {
    if (!mergedItems[key]) {
      // Admin-added product not in bundled JSON.
      mergedItems[key] = adminItems[key];
    }
  });
  const items = {};
  Object.keys(mergedItems).forEach((key) => {
    if (!mergedItems[key]._deleted) items[key] = mergedItems[key];
  });

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

  // --- Admin CRUD helpers ---
  // Each function saves the updated adminInventory to localStorage directly
  // rather than relying on a useEffect, which avoids initialization timing
  // issues (the sync useEffect would fire before the load useEffect completes).

  // updateInventoryItem merges the given fields into an item's admin override.
  // Creates an override entry if one doesn't exist yet for that item.
  const updateInventoryItem = (id, fields) => {
    const updated = {
      items: {
        ...adminItems,
        [id]: {...(adminItems[id] || {}), ...fields, id},
      },
    };
    setAdminInventory(updated);
    localStorage.setItem('adminInventory', JSON.stringify(updated));
  };

  // addInventoryItem assigns the next available numeric ID, saves the new
  // product to adminInventory, and initializes a cart slot for it.
  const addInventoryItem = (item) => {
    const allIds = [
      ...Object.keys(bundledItems),
      ...Object.keys(adminItems).filter((k) => !adminItems[k]._deleted),
    ];
    const numericIds = allIds.map((k) => parseInt(k, 10)).filter(Boolean);
    const nextId = String(Math.max(0, ...numericIds) + 1);
    const newItem = {...item, id: nextId};
    const updated = {items: {...adminItems, [nextId]: newItem}};
    setAdminInventory(updated);
    localStorage.setItem('adminInventory', JSON.stringify(updated));
    // Initialize a cart slot for the new product so totalPrice stays correct.
    setCart((prev) => ({...prev, [nextId]: 0}));
  };

  // removeInventoryItem hides a product from the catalog.
  // Bundled items get a _deleted marker so they can be restored via
  // resetToDefaults. Admin-added items are removed outright.
  const removeInventoryItem = (id) => {
    const updated = {items: {...adminItems}};
    if (bundledItems[id]) {
      // Bundled item: mark as deleted so it's hidden until defaults are reset.
      updated.items[id] = {...(adminItems[id] || {}), id, _deleted: true};
    } else {
      // Admin-added item: remove entirely.
      delete updated.items[id];
    }
    setAdminInventory(updated);
    localStorage.setItem('adminInventory', JSON.stringify(updated));
    setCart((prev) => {
      const next = {...prev};
      delete next[id];
      return next;
    });
  };

  // decrementStock subtracts sold quantities from stock counts.
  // Items with stock === null or undefined (unlimited) are not affected.
  // Called by useCheckout after a successful order.
  const decrementStock = (cartSnapshot) => {
    const updatedAdminItems = {...adminItems};
    Object.keys(cartSnapshot).forEach((key) => {
      const qty = cartSnapshot[key];
      if (!qty) return;
      const existing = updatedAdminItems[key] || {};
      const bundled = bundledItems[key] || {};
      const baseStock = existing.stock !== undefined ?
        existing.stock :
        (bundled.stock !== undefined ? bundled.stock : null);
      if (baseStock === null || baseStock === undefined) return;
      updatedAdminItems[key] = {
        ...bundled,
        ...existing,
        id: key,
        stock: Math.max(0, baseStock - qty),
      };
    });
    const updated = {items: updatedAdminItems};
    setAdminInventory(updated);
    localStorage.setItem('adminInventory', JSON.stringify(updated));
  };

  // resetToDefaults clears all admin overrides, restoring the bundled catalog.
  const resetToDefaults = () => {
    const cleared = {items: {}};
    setAdminInventory(cleared);
    localStorage.removeItem('adminInventory');
    const newCart = {};
    Object.keys(bundledItems).forEach((key) => {
      newCart[key] = 0;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  return {
    items,
    cart,
    setCart,
    totalPrice,
    isReady,
    updateInventoryItem,
    addInventoryItem,
    removeInventoryItem,
    decrementStock,
    resetToDefaults,
  };
};

export default useCart;
