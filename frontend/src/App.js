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

//home
import HomePage from './component/home/HomePage';


//order costomize 
import CustomOrder from './component/constomizeOrder/CustomOrder';
import MyCostomizeOrders from "./component/constomizeOrder/myCostomizeOrders";
import CusotomOrderDetails from "./component/constomizeOrder/CustomOrderDetails";
import UpdateOrder from './component/constomizeOrder/UpdateOrder';
import AllCustomOrders from "./component/constomizeOrder/AllCustomOrders";
import CusOrderDetails from "./component/constomizeOrder/OrderDetails";
import ViewDetail from './component/constomizeOrder/viewDetail';

import CusOnDeliveryOrders from './component/constomizeOrder/CusOnDeliveryOrders';
import CusPendingOrders from './component/constomizeOrder/CusPendingOrders';
import CusCancelledOrders from './component/constomizeOrder/CusCancelledOrders';
import CusCompletedOrders from './component/constomizeOrder/CusCompletedOrders';
import CustomOrderReport from './component/constomizeOrder/CustomOrderReport';
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

          <Route path="/home" element={<HomePage />} />
          <Route path="/customize-order" element={<CustomOrder />} />
          <Route path="/my-customize-order" element={<MyCostomizeOrders />} />
          <Route path="/order-details/:orderId" element={<CusotomOrderDetails />} />
          <Route path="/update-order/:orderId" element={<UpdateOrder />} />
          <Route path="/all-custom-orders" element={<AllCustomOrders />} />
          <Route path="/custom-orders/:orderId" element={<CusOrderDetails />} />
          <Route path="/admin-order-details/:orderId" element={<ViewDetail />} />
          <Route path="/cuson-delivery" element={<CusOnDeliveryOrders />} />
          <Route path="/cuspending" element={<CusPendingOrders />} />
          <Route path="/cuscancelled" element={<CusCancelledOrders />} />
          <Route path="/cuscompleted" element={<CusCompletedOrders />} />
          <Route path="/custom-order-report" element={<CustomOrderReport />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;