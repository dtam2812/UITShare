import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "../common";
import { jwtDecode } from "jwt-decode";

const CartContext = createContext(null);

const getCartKey = (userId) =>
  userId ? `uit_share_cart_${userId}` : "uit_share_cart_guest";

const getCurrentUserId = () => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token || token === "undefined") return null;
    return jwtDecode(token)?._id ?? null;
  } catch {
    return null;
  }
};

export function CartProvider({ children }) {
  const [userId, setUserId] = useState(() => getCurrentUserId());
  const [cartItems, setCartItems] = useState(() => {
    try {
      const uid = getCurrentUserId();
      const stored = localStorage.getItem(getCartKey(uid));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(getCartKey(userId), JSON.stringify(cartItems));
    } catch {}
  }, [cartItems, userId]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "access_token") {
        const newUserId = getCurrentUserId();

        if (!e.newValue) {
          // Đăng xuất: xóa giỏ hàng hiện tại, reset userId
          setCartItems([]);
          setUserId(null);
        } else if (newUserId !== userId) {
          // Đăng nhập tài khoản khác: load giỏ hàng của user mới
          setUserId(newUserId);
          try {
            const stored = localStorage.getItem(getCartKey(newUserId));
            setCartItems(stored ? JSON.parse(stored) : []);
          } catch {
            setCartItems([]);
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [userId]);

  const reloadCartForCurrentUser = useCallback(() => {
    const newUserId = getCurrentUserId();
    setUserId(newUserId);
    try {
      const stored = localStorage.getItem(getCartKey(newUserId));
      setCartItems(stored ? JSON.parse(stored) : []);
    } catch {
      setCartItems([]);
    }
  }, []);

  const addToCart = useCallback(
    async (doc) => {
      if (cartItems.some((item) => item._id === doc._id)) {
        return { success: false, reason: "already_in_cart" };
      }

      try {
        const token = localStorage.getItem("access_token");
        if (token && token !== "undefined") {
          const res = await axios.get(`/api/marketplace/access/${doc._id}`);
          if (res.data?.hasAccess && res.data?.reason === "owner") {
            return { success: false, reason: "already_owned" };
          }
        }
      } catch {
        // Nếu API lỗi thì vẫn cho thêm vào giỏ, backend sẽ check lúc mua
      }

      setCartItems((prev) => [...prev, doc]);
      return { success: true };
    },
    [cartItems],
  );

  const removeFromCart = useCallback((docId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== docId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(getCartKey(userId));
  }, [userId]);

  const removeMultipleFromCart = useCallback((docIds) => {
    setCartItems((prev) => prev.filter((item) => !docIds.includes(item._id)));
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        removeMultipleFromCart,
        reloadCartForCurrentUser,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
