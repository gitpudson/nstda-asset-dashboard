import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Dashboard/Home";
import OrgDashboard from "../pages/Dashboard/OrgDashboard";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/nstda-asset-dashboard" element={<Home />} />
          <Route path="/nstda-asset-dashboard/org/:org" element={<OrgDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}