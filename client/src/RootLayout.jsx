import { Outlet } from "react-router";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { CartProvider } from "./context/CartContext";
import { WagmiProvider } from "wagmi";
import { config } from "./config/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <div>
            <Toaster
              position="bottom-center" 
              reverseOrder={false}
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#333',
                  color: '#fff',
                  padding: '16px',
                  borderRadius: '10px',
                },
                error: {
                  style: {
                    background: '#fef2f2', 
                    color: '#991b1b',      
                    border: '1px solid #f87171',
                  },
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Outlet />
          </div>
        </CartProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default RootLayout;
