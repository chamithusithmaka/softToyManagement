import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../home/HomeHeader"; // Import the HomeHeader component
import { useParams } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const CustomOrderDetails = () => {
    const { orderId } = useParams(); // Get the order ID from the URL
    const [order, setOrder] = useState(null);
    const [deliveryStatus, setDeliveryStatus] = useState(""); // Store delivery status
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch order details and delivery status by order ID
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // Fetch order details
                const response = await axios.get(`http://localhost:5555/api/costomorders/${orderId}`);
                const fetchedOrder = response.data;

                // Fetch delivery status for the order
                try {
                    const statusResponse = await axios.get(`http://localhost:5555/api/delivery/status/${fetchedOrder.orderId}`);
                    const fetchedDeliveryStatus = statusResponse.data.status;

                    // Set the order and delivery status
                    setOrder(fetchedOrder);
                    setDeliveryStatus(fetchedDeliveryStatus);
                } catch (statusError) {
                    console.error(`Error fetching delivery status for order ${fetchedOrder.orderId}:`, statusError);
                    setDeliveryStatus("N/A"); // Default to "N/A" if status fetch fails
                }
            } catch (error) {
                console.error("Error fetching order details:", error);
                setErrorMessage("Failed to fetch order details. Please try again later.");
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    // Handle cancel order
    const handleCancelOrder = async () => {
        console.log(`Attempting to cancel order with orderId: ${order.orderId}`);
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                const response = await axios.patch(`http://localhost:5555/api/delivery/cancel/${order.orderId}`);
                console.log("Cancel order response:", response.data);
                setSuccessMessage(response.data.message || "Order cancelled successfully!");
                setDeliveryStatus("Cancelled"); // Update the delivery status locally
            } catch (error) {
                console.error("Error cancelling order:", error);
                setErrorMessage(
                    error.response?.data?.message || "Failed to cancel the order. Please try again."
                );
            }
        }
    };

    return (
        <div>
            <Header />
            <div className="container mt-5">
                <h2 className="text-center mb-4">Order Details</h2>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                {order ? (
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Order ID: {order.orderId}</h5>
                            <div>
                                {deliveryStatus === "Pending" ? (
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={handleCancelOrder}
                                    >
                                        <FaTimesCircle className="me-1" /> Cancel
                                    </button>
                                ) : (
                                    <button className="btn btn-secondary btn-sm" disabled>
                                        Cannot Cancel
                                    </button>
                                )}
                            </div>
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
                                            deliveryStatus === "Delivered"
                                                ? "bg-success"
                                                : deliveryStatus === "Out for Delivery"
                                                ? "bg-info text-dark"
                                                : deliveryStatus === "Pending"
                                                ? "bg-warning text-dark"
                                                : deliveryStatus === "Cancelled"
                                                ? "bg-danger"
                                                : "bg-secondary"
                                        } ms-2`}>
                                            {deliveryStatus || "N/A"}
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