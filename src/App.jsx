import { RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { MenuProvider } from "./context/MenuContext.jsx";
import { InventoryProvider } from "./context/InventoryContext.jsx";
import { TransactionProvider } from "./context/TransactionContext.jsx";
import { StaffProvider } from "./context/StaffContext.jsx";
import { router } from "./config/routes.jsx";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <MenuProvider>
            <InventoryProvider>
              <TransactionProvider>
                <StaffProvider>
                  <RouterProvider router={router} />
                  {/* Change "top" to "top-left" here */}
                  <Toaster position="top-left" />
                </StaffProvider>
              </TransactionProvider>
            </InventoryProvider>
          </MenuProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
