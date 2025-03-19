import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManagerHeader from './managerHeader';

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5555/api/completed');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching completed orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedOrders();
  }, []);

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5555/api/orders/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <ManagerHeader />

      {/* Main Content */}
      <div className="container-fluid" style={{ marginLeft: '16rem' }}>
        <h1 className="text-center text-success mb-4">Completed Orders</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-center">No completed orders found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-success">
                <tr>
                  <th>Customer Name</th>
                  <th>Items</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order.customerInfo.name}</td>
                    <td>
                      {order.items.map(item => (
                        <div key={item._id}>{item.name} (x{item.quantity})</div>
                      ))}
                    </td>
                    <td>
                      {order.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)} LKR
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedOrders;