import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Inventory
import InventoryItems from "./component/InventoryManagement/s-InventoryItems";
import CategoriesList from "./component/InventoryManagement/CategoriesList";
import AddCategoryForm from "./component/InventoryManagement/addCatagory";
import UpdateCategory from "./component/InventoryManagement/UpdateCategory";
import CategoryDetail from "./component/InventoryManagement/CategoryDetail";
import AddItemForm from "./component/InventoryManagement/AddItem";
import ItemDetailsssss from "./component/InventoryManagement/ItemDetails";
import InventorySummaryReport from "./component/InventoryManagement/summery";

// Online Store
import AdminHome from './component/store/pages/Home/AdminHome';
import Store from './component/store/pages/Home/Store';
import ItemDetails from './component/store/pages/Home/ItemDetails';
import Cart from './component/store/pages/Home/Cart';
import Checkout from './component/store/components/checkout';
import MyOrders from './component/store/components/MyOrders';

//order 
import CancelledOrders from "./component/orderManagement/CancelledOrders";
import CompletedOrders from "./component/orderManagement/CompletedOrders";
import PendingOrders from "./component/orderManagement/PendingOrders";
import SalesSummary from "./component/orderManagement/SalesSummary";
import OrderList from './component/orderManagement/OrderList';
import ItemList from './component/orderManagement/InventoryItems';
import OrderDetails from './component/orderManagement/OrderDetails';

function App() {
  const [cart, setCart] = useState([]); // State for the cart

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/inv" element={<InventoryItems />} />
          <Route path="/dashboard/inventory" element={<InventoryItems />} />
          <Route path="/dashboard/addcatagory" element={<AddCategoryForm />} />
          <Route path="/dashboard/catagory" element={<CategoriesList />} />
          <Route path="/dashboard/additem" element={<AddItemForm />} />
          <Route path="/categories/:id" element={<CategoryDetail />} />
          <Route path="/categories/:id/edit" element={<UpdateCategory />} />
          <Route path="/dashboard/summery" element={<InventorySummaryReport />} />
          <Route path="/items/:id" element={<ItemDetailsssss />} />
          <Route path="/store-items/:itemId" element={<ItemDetails cart={cart} setCart={setCart} />} />

          <Route path="/" element={<AdminHome />} />
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/Store" element={<Store cart={cart} setCart={setCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/my-orders" element={<MyOrders />} />

          <Route path="/orders" element={<OrderList />} />
          <Route path="/cancel" element={<CancelledOrders />} />
          <Route path="/finish" element={<CompletedOrders />} />
          <Route path="/report" element={<SalesSummary />} />
          <Route path="/pending" element={<PendingOrders />} />
          <Route path="/inventory" element ={<ItemList />}/>
          <Route path="/orderlist" element={<OrderList />}/>
          <Route path="/orders/:orderId" element={<OrderDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;