import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

function RootLayout() {
  return (
    <>
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
    </>
  )
}

export default RootLayout;
