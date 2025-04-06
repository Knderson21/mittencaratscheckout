import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

// Local imports
import { useAppContext } from "./utils/appContext";
import { Login, Header, Store } from "./pages";
import storedInventory from "./constants/inventory.json";
import "./App.scss";

const App = () => {
  const { token, paymentMethod, setToken, totalPrice, reference, setTotalPrice, setPaymentMethod, setNotes, setReference } = useAppContext();
  const [inventory, setInventory] = useState({});
  const [cart, setCart] = useState({});

  useEffect(() => {
    setInventory({ ...storedInventory });
    const storedPaymentMethod = localStorage.getItem("potionPaymentMethod");
    const storedNotes = localStorage.getItem("potionNotes");
    const storedReference = localStorage.getItem("potionReference");
    const storedToken = localStorage.getItem("potionToken");

    if (storedPaymentMethod) setPaymentMethod(storedPaymentMethod);
    if (storedNotes) setNotes(storedNotes);
    if (storedReference) setReference(storedReference);
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (Object.keys(cart).length === 0) return;
    localStorage.setItem("potionCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("potionPaymentMethod", paymentMethod);
  }, [paymentMethod]);

  useEffect(() => {
    localStorage.setItem("potionNotes", notes);
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("potionReference", reference);
  }, [reference]);

  useEffect(() => {
    localStorage.setItem("potionToken", token);
  }, [token]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("potionCart"));
    if (storedCart) {
      setCart(storedCart);
      return;
    }
    // set cart to have all keys to 0
    if (Object.keys(inventory).length > 0) {
      const newCart = {};
      Object.keys(inventory.items).forEach((key) => {
        newCart[key] = 0;
      });
      setCart(newCart);
    }
  }, [inventory]);

  if (Object.keys(inventory).length === 0) {
    return null;
  }

  if (Object.keys(cart).length === 0) {
    return null;
  }

  Object.keys(cart).forEach((key) => {
    setTotalPrice(
      (prevTotal) => prevTotal + inventory.items[key].price * cart[key],
    );
  });

  if (!token) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<Login token={token} setToken={setToken} />}
        />
      </Routes>
    );
  }

  return (
    <div className="appContainer">
      <div className="pageContainer">
        <Header />
        <Routes>
          <Route
            path="/"
            exact="true"
            element={
              <Store
                potions={inventory.items}
                cart={cart}
                notes={notes}
                setCart={setCart}
                setNotes={setNotes}
                totalPrice={totalPrice}
              />
            }
          />
          <Route
            path="/login"
            exact="true"
            element={<Login token={token} setToken={setToken} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
