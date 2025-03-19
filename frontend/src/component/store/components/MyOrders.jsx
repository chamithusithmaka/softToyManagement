import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = () => {
      const loggedInUser = JSON.parse(localStorage.getItem('user'));
      if (loggedInUser && loggedInUser.userId) {
        setUserId(loggedInUser.userId);
      } else {
        setError('User is not logged in or user data is missing.');
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/api/user/${userId}`);
        setOrders(response.data);
      } catch (error) {
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleBack = () => {
    navigate('/store');
  };

  // Function to calculate total amount for each order
  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="container my-5">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="btn btn-outline-primary btn-lg px-4 py-2"
          style={{
            borderRadius: '25px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          &larr; Back to Store
        </button>
      </div>

      {/* Title */}
      <h2 className="text-center mb-4">My Orders</h2>

      {/* Loading and Error States */}
      {loading && <p className="text-center text-muted">Loading orders...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {/* Orders */}
      {orders.length > 0 ? (
        <div className="row">
          {orders.map((order) => (
            <div key={order._id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  {/* Order Status */}
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`badge ${
                        order.status === 'Completed'
                          ? 'bg-success'
                          : order.status === 'Pending'
                          ? 'bg-warning text-dark'
                          : 'bg-danger'
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>

                  {/* Total Amount */}
                  <p>
                    <strong>Total Amount:</strong> LKR {calculateTotalAmount(order.items)}
                  </p>

                  {/* Items */}
                  <h5 className="mt-3">Items:</h5>
                  <ul className="list-group">
                    {order.items.map((item) => (
                      <li key={item._id} className="list-group-item d-flex justify-content-between">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>LKR {item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Customer Information */}
                  <div className="mt-3">
                    <h5>Customer Information:</h5>
                    <p>Name: {order.customerInfo.name}</p>
                    <p>Address: {order.customerInfo.address}</p>
                    <p>Phone: {order.customerInfo.phone}</p>
                    <p>Email: {order.customerInfo.email}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-center text-muted">No orders found.</p>
      )}
    </div>
  );
}

export default MyOrders;