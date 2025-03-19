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
                    <div className="card shadow">
                        <div className="card-body">
                            <h5 className="card-title">Order ID: {order.orderId}</h5>
                            <p><strong>Toy Type:</strong> {order.toyType}</p>
                            <p><strong>Size:</strong> {order.size}</p>
                            <p><strong>Fabric:</strong> {order.fabric}</p>
                            <p><strong>Color:</strong> {order.color}</p>
                            <p><strong>Message:</strong> {order.message || "N/A"}</p>
                            <p><strong>Accessories:</strong> {order.accessories.join(", ") || "None"}</p>
                            <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
                            <p><strong>Quantity:</strong> {order.quantity}</p>
                            <p><strong>Total Price:</strong> LKR {order.totalPrice}</p>
                            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                            <p><strong>Shipping Method:</strong> {order.shippingMethod}</p>
                            <p><strong>Status:</strong> {order.status}</p>
                            <h5 className="mt-4">Customer Information</h5>
                            <p><strong>Name:</strong> {order.customerInfo.name}</p>
                            <p><strong>Address:</strong> {order.customerInfo.address}</p>
                            <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                            <p><strong>Email:</strong> {order.customerInfo.email}</p>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">Loading order details...</p>
                )}
            </div>
            {/* Footer */}
      <footer className="bg-primary text-white text-center py-3">
        <p>&copy; 2023 My Store. All rights reserved.</p>
      </footer>
        </div>
    );
};

export default CustomOrderDetails;