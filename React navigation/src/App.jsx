import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Product from "./pages/Product";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<Product />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;