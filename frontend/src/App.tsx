import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import Cafes from "@/pages/cafes";
import Employees from "@/pages/employees";
import AddEditCafe from "@/pages/addeditcafe";
import AddEditEmployee from "@/pages/addeditemployee";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<Cafes />} path="/cafes" />
      <Route element={<AddEditCafe />} path="/cafes/new" />
      <Route element={<AddEditCafe />} path="/cafes/:id" />
      <Route element={<Employees />} path="/employees" />
      <Route element={<AddEditEmployee />} path="/employees/new" />
      <Route element={<AddEditEmployee />} path="/employees/:id" />
    </Routes>
  );
}

export default App;
