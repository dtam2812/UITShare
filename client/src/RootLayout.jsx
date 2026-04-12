import { Outlet } from "react-router";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { CartProvider } from "./context/CartContext";
import { WagmiProvider } from "wagmi";
import { config } from "./config/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <div>
            <Outlet />
          </div>
        </CartProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default RootLayout;
