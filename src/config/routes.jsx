import { createBrowserRouter } from "react-router";
import { RootLayout } from "../components/layout/RootLayout.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { CashierPage } from "../pages/CashierPage.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { InventoryPage } from "../pages/InventoryPage.jsx";
import { MenuManagementPage } from "../pages/MenuManagementPage.jsx";
import { TransactionHistoryPage } from "../pages/TransactionHistoryPage.jsx";
import { StaffManagementPage } from "../pages/StaffManagementPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: CashierPage },
      { path: "dashboard", Component: DashboardPage },
      { path: "inventory", Component: InventoryPage },
      { path: "menu", Component: MenuManagementPage },
      { path: "transactions", Component: TransactionHistoryPage },
      { path: "staff", Component: StaffManagementPage },
    ],
  },
]);
