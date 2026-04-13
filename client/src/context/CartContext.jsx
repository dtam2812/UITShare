import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  function addToCart(doc) {
    setCartItems((prev) =>
      prev.find((item) => item._id === doc._id) ? prev : [...prev, doc],
    );
  }

  function removeFromCart(id) {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  }

  function clearCart() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
