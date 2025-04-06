import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [inventory, setInventory] = useState({});
  const [cart, setCart] = useState({});
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <AppContext.Provider
      value={{
        token,
        setToken,
        inventory,
        setInventory,
        cart,
        setCart,
        reference,
        setReference,
        notes,
        setNotes,
        paymentMethod,
        setPaymentMethod,
        loading,
        setLoading,
        totalPrice,
        setTotalPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
