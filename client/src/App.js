import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Error from "./pages/Error";
import SearchStore from "./pages/SearchStore";
import Store from "./pages/Store";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import AddMedicine from "./pages/AddMedicine";
import ManageMedicines from "./pages/ManageMedicines";
import NeedHelp from "./pages/NeedHelp";
import PrescriptionUpload from "./pages/PrescriptionUpload";
import Medicines from "./pages/Medicines";
import Healthcare from "./pages/Healthcare";
import LabTests from "./pages/LabTests";
import HealthBlogs from "./pages/HealthBlogs";
import ValueStore from "./pages/ValueStore";
import Offers from "./pages/Offers";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/error" element={<Error />} />
            <Route path="/search" element={<SearchStore />} />
            <Route path="/store" element={<Store />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/add-medicine" element={<AddMedicine />} />
            <Route path="/admin/manage-medicines" element={<ManageMedicines />} />
            <Route path="/need-help" element={<NeedHelp />} />
            <Route path="/prescription-upload" element={<PrescriptionUpload />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/healthcare" element={<Healthcare />} />
            <Route path="/lab-tests" element={<LabTests />} />
            <Route path="/health-blogs" element={<HealthBlogs />} />
            <Route path="/value-store" element={<ValueStore />} />
            <Route path="/offers" element={<Offers />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
