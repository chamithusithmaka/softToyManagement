import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "./adminSideBar";

const AllCustomOrders = () => {
    const [orders, setOrders] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Fetch all customized orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5555/api/costomorders");
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setErrorMessage("Failed to fetch orders. Please try again later.");
            }
        };

        fetchOrders();
    }, []);

    // Handle view button click
    const handleViewOrder = (orderId) => {
        navigate(`/admin-order-details/${orderId}`); // Navigate to the order details page
    };

    return (
        <div className="d-flex">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main Content */}
      <div className="container-fluid" style={{ marginLeft: '16rem' }}>
                <h2 className="text-center mb-4">All Customized Orders</h2>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Name</th>
                                <th>Toy Type</th>
                                <th>Quantity</th>
                                <th>Total Price (LKR)</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order.orderId}</td>
                                        <td>{order.customerInfo.name}</td>
                                        <td>{order.toyType}</td>
                                        <td>{order.quantity}</td>
                                        <td>{order.totalPrice}</td>
                                        <td>{order.status}</td>
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleViewOrder(order._id)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllCustomOrders;