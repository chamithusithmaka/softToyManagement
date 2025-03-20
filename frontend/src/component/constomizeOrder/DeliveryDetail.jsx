import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DeliveryDetail = () => {
    const { orderId } = useParams(); // Get orderId from the URL
    const [order, setOrder] = useState(null); // Store order details
    const [postalCode, setPostalCode] = useState(""); // Store postal code
    const [additionalNotes, setAdditionalNotes] = useState(""); // Store additional notes
    const [errorMessage, setErrorMessage] = useState(""); // Store error messages
    const [successMessage, setSuccessMessage] = useState(""); // Store success messages

    // Fetch order details by orderId
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/custom-orders/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                console.error("Error fetching order details:", error);
                setErrorMessage("Failed to fetch order details. Please try again later.");
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!postalCode) {
            setErrorMessage("Postal code is required.");
            return;
        }

        // Simulate saving delivery details
        console.log("Delivery details submitted:", {
            orderId,
            postalCode,
            additionalNotes,
        });

        setSuccessMessage("Delivery details submitted successfully!");
        setErrorMessage("");
    };

    if (!order) {
        return <div className="text-center mt-5">Loading order details...</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Delivery Details</h1>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <div className="card shadow-lg">
                <div className="card-body">
                    <h5 className="card-title text-primary">Order Summary</h5>
                    <p><strong>Order ID:</strong> {order.orderId}</p>
                    <p><strong>Customer Name:</strong> {order.customerInfo.name}</p>
                    <p><strong>Delivery Address:</strong> {order.customerInfo.address}</p>
                    <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                    <p><strong>Email:</strong> {order.customerInfo.email}</p>
                    <p><strong>Total Price:</strong> LKR {order.totalPrice.toLocaleString()}</p>
                </div>
            </div>

            <form className="mt-4" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Postal Code:</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter postal code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Additional Notes (Optional):</label>
                    <textarea
                        className="form-control"
                        placeholder="Enter any additional notes for delivery"
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        rows="3"
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">Submit Delivery Details</button>
            </form>
        </div>
    );
};

export default DeliveryDetail;