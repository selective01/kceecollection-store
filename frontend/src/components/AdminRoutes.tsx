// AdminRoutes.tsx — admin route tree
import { Routes, Route } from "react-router-dom";
import AdminLayout    from "../components/AdminLayout";
import ProtectedAdmin from "../components/ProtectedAdmin";
import React from "react";

const AdminLogin       = React.lazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard   = React.lazy(() => import("../pages/admin/AdminDashboard"));
const AdminOrders      = React.lazy(() => import("../pages/admin/AdminOrders"));
const AdminProducts    = React.lazy(() => import("../pages/admin/AdminProducts"));
const AdminUsers       = React.lazy(() => import("../pages/admin/AdminUsers"));
const AdminCategories  = React.lazy(() => import("../pages/admin/AdminCategories"));
const AdminNewArrivals = React.lazy(() => import("../pages/admin/AdminNewArrivals"));
const AdminSalesReport = React.lazy(() => import("../pages/admin/AdminSalesReport"));
const AdminShipping    = React.lazy(() => import("../pages/admin/AdminShipping"));
const AdminInventory   = React.lazy(() => import("../pages/admin/AdminInventory"));
const AdminCoupons     = React.lazy(() => import("../pages/admin/AdminCoupons"));
const AdminMessages    = React.lazy(() => import("../pages/admin/AdminMessages"));

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route element={<ProtectedAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index               element={<AdminDashboard />} />
          <Route path="orders"       element={<AdminOrders />} />
          <Route path="products"     element={<AdminProducts />} />
          <Route path="users"        element={<AdminUsers />} />
          <Route path="categories"   element={<AdminCategories />} />
          <Route path="newarrivals"  element={<AdminNewArrivals />} />
          <Route path="sales-report" element={<AdminSalesReport />} />
          <Route path="shipping"     element={<AdminShipping />} />
          <Route path="inventory"    element={<AdminInventory />} />
          <Route path="coupons"      element={<AdminCoupons />} />
          <Route path="messages"     element={<AdminMessages />} />
          <Route path="*"            element={<div>404 - Admin page not found</div>} />
        </Route>
      </Route>
    </Routes>
  );
}
