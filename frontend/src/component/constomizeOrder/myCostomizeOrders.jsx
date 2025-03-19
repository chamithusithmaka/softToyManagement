import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../home/HomeHeader"; // Import the HomeHeader component
import { useNavigate } from "react-router-dom";

const MyCostomizeOrders = () => {
    const [orders, setOrders] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Fake user ID for demonstration purposes
    const userId = "fakeUserId123";

    // Fetch orders based on user ID
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/costomorders?userId=${userId}`);
                setOrders(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setErrorMessage("Failed to fetch orders. Please try again later.");
            }
        };

        fetchOrders();
    }, [userId]);

    // Handle view button click
    const handleViewOrder = (orderId) => {
        navigate(`/order-details/${orderId}`); // Navigate to the order details page
    };

    return (
        <div>
            <Header />
            <div className="container mt-5">
                <h2 className="text-center mb-4">My Customized Orders</h2>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>Order ID</th>
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
                                        <td>{order.toyType}</td>
                                        <td>{order.quantity}</td>
                                        <td>{order.totalPrice !== undefined ? order.totalPrice : "N/A"}</td>
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
                                    <td colSpan="6" className="text-center">
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

export default MyCostomizeOrders;