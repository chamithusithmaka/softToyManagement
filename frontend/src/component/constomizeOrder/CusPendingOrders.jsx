import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSideBar from "./adminSideBar";

const CusPending = () => {
    const [orders, setOrders] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchPendingOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5555/api/customorders/pending");
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching pending orders:", error);
                setErrorMessage("Failed to fetch pending orders. Please try again later.");
            }
        };

        fetchPendingOrders();
    }, []);

    return (
        <div className="d-flex">
        {/* Sidebar */}
        <AdminSideBar />
  
        {/* Main Content */}
        <div className="container-fluid" style={{ marginLeft: '16rem' }}>
                <h2 className="text-center mb-4">Pending Orders</h2>
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No pending orders found.
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

export default CusPending;