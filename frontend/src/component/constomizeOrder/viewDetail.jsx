import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaTimesCircle, FaTrash } from "react-icons/fa";

const ViewDetail = () => {
    const { orderId } = useParams(); // Get the order ID from the URL
    const navigate = useNavigate(); // Hook for navigation
    const [order, setOrder] = useState(null);
    const [deliveryStatus, setDeliveryStatus] = useState(""); // Store delivery status
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch order details and delivery status by order ID
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                console.log(`Fetching order details for orderId: ${orderId}`);
                // Fetch order details
                const response = await axios.get(`http://localhost:5555/api/costomorders/${orderId}`);
                const fetchedOrder = response.data;
                console.log("Fetched order details:", fetchedOrder);

                // Fetch delivery status for the order
                try {
                    console.log(`Fetching delivery status for orderId: ${fetchedOrder.orderId}`);
                    const statusResponse = await axios.get(`http://localhost:5555/api/delivery/status/${fetchedOrder.orderId}`);
                    const fetchedDeliveryStatus = statusResponse.data.status;
                    console.log("Fetched delivery status:", fetchedDeliveryStatus);

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

    // Handle delete order
    const handleDeleteOrder = async () => {
        console.log(`Attempting to delete order with orderId: ${order.orderId}`);
        if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
            try {
                const response = await axios.delete(`http://localhost:5555/api/custom-orders/delete-by-orderId/${order.orderId}`);
                console.log("Delete order response:", response.data);
                setSuccessMessage(response.data.message || "Order deleted successfully!");
                setOrder(null); // Clear the order details after deletion
                setTimeout(() => {
                    navigate("/all-custom-orders"); // Navigate to /all-custom-orders after a short delay
                }, 1000); // Optional delay for better user experience
            } catch (error) {
                console.error("Error deleting order:", error);
                setErrorMessage(
                    error.response?.data?.message || "Failed to delete the order. Please try again."
                );
            }
        }
    };

    return (
        <div className="d-flex">
            <div className="container mt-5">
                <h2 className="text-center mb-4">Order Details</h2>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                {order ? (
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Order ID: {order.orderId}</h5>
                            <div>
                                {deliveryStatus === "Pending" || deliveryStatus === "Out for Delivery" ? (
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
                                {deliveryStatus === "Cancelled" && (
                                    <button
                                        className="btn btn-danger btn-sm ms-2"
                                        onClick={handleDeleteOrder}
                                    >
                                        <FaTrash className="me-1" /> Delete
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <p><strong>Customer Name:</strong> {order.customerInfo.name}</p>
                                    <p><strong>Address:</strong> {order.customerInfo.address}</p>
                                    <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                                    <p><strong>Email:</strong> {order.customerInfo.email}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <p><strong>Toy Type:</strong> {order.toyType}</p>
                                    <p><strong>Size:</strong> {order.size}</p>
                                    <p><strong>Fabric:</strong> {order.fabric}</p>
                                    <p><strong>Color:</strong> {order.color}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <p><strong>Message:</strong> {order.message || "N/A"}</p>
                                    <p><strong>Accessories:</strong> {order.accessories.join(", ") || "None"}</p>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <p><strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}</p>
                                    <p><strong>Quantity:</strong> {order.quantity}</p>
                                    <p><strong>Total Price:</strong> LKR {order.totalPrice}</p>
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
                        </div>
                    </div>
                ) : (
                    <p className="text-center">Loading order details...</p>
                )}
            </div>
        </div>
    );
};

export default ViewDetail;