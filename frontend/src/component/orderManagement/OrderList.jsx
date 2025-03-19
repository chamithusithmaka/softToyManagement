import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManagerHeader from './managerHeader';
import { FaSearch } from 'react-icons/fa';

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5555/api/orders?status=Pending');
                setOrders(response.data);
                setFilteredOrders(response.data); // Initialize filtered orders
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        const result = orders.filter(order =>
            order.customerInfo.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredOrders(result);
    }, [searchQuery, orders]);

    const handleDetails = (orderId) => {
        window.location.href = `/orders/${orderId}`;
    };

    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'text-success';
            case 'pending':
                return 'text-warning';
            case 'cancelled':
                return 'text-danger';
            default:
                return '';
        }
    };

    return (
        <div className="d-flex">
      {/* Sidebar */}
      <ManagerHeader />

      {/* Main Content */}
      <div className="container-fluid" style={{ marginLeft: '16rem' }}>
                <h2 className="fw-bold mb-4">All Orders</h2>
                <div className="mb-4">
                    <div className="position-relative">
                        <input
                            type="text"
                            placeholder="Search by Customer Name"
                            className="form-control"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
                    </div>
                </div>
                {filteredOrders.length === 0 ? (
                    <p className="text-muted">No orders found.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-secondary">
                                <tr>
                                    <th>Customer Name</th>
                                    <th>Status</th>
                                    <th>Items</th>
                                    <th>Total Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map(order => (
                                    <tr key={order._id}>
                                        <td>{order.customerInfo.name}</td>
                                        <td className={getStatusClass(order.status)}>{order.status}</td>
                                        <td>
                                            {order.items.map(item => (
                                                <div key={item._id}>
                                                    {item.name} x {item.quantity}
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            LKR: {order.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleDetails(order._id)}
                                            >
                                                See Details
                                            </button>
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
}

export default OrderList;