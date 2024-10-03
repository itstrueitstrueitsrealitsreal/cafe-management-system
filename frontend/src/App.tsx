import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import CafesPage from "@/pages/cafes";
import Employees from "@/pages/employees";
import AddEditCafePage from "@/pages/addeditcafe";
import AddEditEmployeePage from "@/pages/addeditemployee";

function App() {
  return (
    <Routes>
      {/* Static pages */}
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      {/* Cafes-related routes */}
      <Route element={<CafesPage />} path="/cafes" />
      <Route element={<AddEditCafePage />} path="/cafes/new" />
      <Route element={<AddEditCafePage />} path="/cafes/:id" />{" "}
      {/* For editing a specific cafe */}
      {/* Employees-related routes */}
      <Route element={<Employees />} path="/employees" />
      <Route element={<AddEditEmployeePage />} path="/employees/new" />
      <Route element={<AddEditEmployeePage />} path="/employees/:id" />{" "}
      {/* For editing a specific employee */}
    </Routes>
  );
}

export default App;
