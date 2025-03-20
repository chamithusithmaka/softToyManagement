import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../home/HomeHeader"; // Import the HomeHeader component
import { useParams } from "react-router-dom";

const CustomOrderDetails = () => {
    const { orderId } = useParams(); // Get the order ID from the URL
    const [order, setOrder] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch order details by order ID
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/costomorders/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                console.error("Error fetching order details:", error);
                setErrorMessage("Failed to fetch order details. Please try again later.");
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    return (
        <div>
            <Header />
            <div className="container mt-5">
                <h2 className="text-center mb-4">Order Details</h2>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                {order ? (
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Order ID: {order.orderId}</h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                {/* Toy Details */}
                                <div className="col-md-6 mb-3">
                                    <h5 className="text-primary">Toy Details</h5>
                                    <p><strong>Toy Type:</strong> {order.toyType}</p>
                                    <p><strong>Size:</strong> {order.size}</p>
                                    <p><strong>Fabric:</strong> {order.fabric}</p>
                                    <p><strong>Color:</strong> {order.color}</p>
                                    <p><strong>Message:</strong> {order.message || "N/A"}</p>
                                    <p><strong>Accessories:</strong> {order.accessories.join(", ") || "None"}</p>
                                </div>

                                {/* Delivery Details */}
                                <div className="col-md-6 mb-3">
                                    <h5 className="text-primary">Delivery Details</h5>
                                    <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
                                    <p><strong>Quantity:</strong> {order.quantity}</p>
                                    <p><strong>Total Price:</strong> LKR {order.totalPrice}</p>
                                    <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                                    <p><strong>Shipping Method:</strong> {order.shippingMethod}</p>
                                    <p><strong>Status:</strong> 
                                        <span className={`badge ${
                                            order.status === "Completed"
                                                ? "bg-success"
                                                : order.status === "Pending"
                                                ? "bg-warning text-dark"
                                                : order.status === "Cancelled"
                                                ? "bg-danger"
                                                : "bg-info text-dark"
                                        } ms-2`}>
                                            {order.status}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <hr />

                            {/* Customer Information */}
                            <div className="row">
                                <div className="col-md-12">
                                    <h5 className="text-primary">Customer Information</h5>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <p><strong>Name:</strong> {order.customerInfo.name}</p>
                                    <p><strong>Address:</strong> {order.customerInfo.address}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                                    <p><strong>Email:</strong> {order.customerInfo.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">Loading order details...</p>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-primary text-white text-center py-3 mt-5">
                <p>&copy; 2023 My Store. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default CustomOrderDetails;