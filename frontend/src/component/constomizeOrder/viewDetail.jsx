import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSideBar from "./adminSideBar";
import { FaTrash, FaTimesCircle } from "react-icons/fa";

const ViewDetail = () => {
    const { orderId } = useParams(); // Get the order ID from the URL
    const [order, setOrder] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

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

    // Handle delete order
    const handleDeleteOrder = async () => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await axios.delete(`http://localhost:5555/api/costomorders/${orderId}`);
                setSuccessMessage("Order deleted successfully!");
                setTimeout(() => navigate("/all-custom-orders"), 2000); // Redirect after 2 seconds
            } catch (error) {
                console.error("Error deleting order:", error);
                setErrorMessage("Failed to delete the order. Please try again.");
            }
        }
    };

    // Handle cancel order
    const handleCancelOrder = async () => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                await axios.patch(`http://localhost:5555/api/costomorders/${orderId}/status`, { status: "Cancelled" });
                setSuccessMessage("Order cancelled successfully!");
                setOrder((prevOrder) => ({ ...prevOrder, status: "Cancelled" }));
            } catch (error) {
                console.error("Error cancelling order:", error);
                setErrorMessage("Failed to cancel the order. Please try again.");
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
                                <button
                                    className="btn btn-danger btn-sm me-2"
                                    onClick={handleDeleteOrder}
                                >
                                    <FaTrash className="me-1" /> Delete
                                </button>
                                {order.status !== "Cancelled" && (
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={handleCancelOrder}
                                    >
                                        <FaTimesCircle className="me-1" /> Cancel
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
                                    <p><strong>Status:</strong> {order.status}</p>
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