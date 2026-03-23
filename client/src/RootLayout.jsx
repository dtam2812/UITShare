import { Outlet } from "react-router";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { CartProvider } from "./context/CartContext";

function RootLayout() {
  return (
    <CartProvider>
      <div>
        <Header />
        <Outlet />
        <Footer />
      </div>
    </CartProvider>
  );
}

export default RootLayout;
