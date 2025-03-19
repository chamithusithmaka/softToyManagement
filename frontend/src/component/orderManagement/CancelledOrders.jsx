import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManagerHeader from './managerHeader';
import { FaTrashAlt } from 'react-icons/fa';

const CancelledOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(null); // For delete confirmation

  useEffect(() => {
    const fetchCancelledOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5555/api/cancelled');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching cancelled orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelledOrders();
  }, []);

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:5555/api/orders/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
      setConfirmDelete(null); // Reset confirmation
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
        <h1 className="text-center text-danger fw-bold mb-4">Cancelled Orders</h1>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-center">No cancelled orders found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-danger">
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

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
          <div className="bg-white rounded shadow p-4">
            <h3 className="mb-3">Confirm Deletion</h3>
            <p>Are you sure you want to delete this order?</p>
            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-danger me-2"
                onClick={() => deleteOrder(confirmDelete)}
              >
                Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CancelledOrders;