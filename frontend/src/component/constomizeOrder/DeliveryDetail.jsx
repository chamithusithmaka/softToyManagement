import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const DeliveryRequest = () => {
    const { orderId } = useParams(); // Get orderId from the URL
    const [order, setOrder] = useState(null); // Store order details
    const [deliveryAddress, setDeliveryAddress] = useState(""); // Store delivery address
    const [phone, setPhone] = useState(""); // Store phone number
    const [postalCode, setPostalCode] = useState(""); // Store postal code
    const [specialNotes, setSpecialNotes] = useState(""); // Store special notes
    const [errorMessage, setErrorMessage] = useState(""); // Store error messages
    const [successMessage, setSuccessMessage] = useState(""); // Store success messages

    // Fetch order details by orderId
    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/custom-orders/${orderId}`);
                setOrder(response.data);
                setDeliveryAddress(response.data.customerInfo.address);
                setPhone(response.data.customerInfo.phone);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching order details:", error);
                setErrorMessage("Failed to fetch order details. Please try again later.");
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!postalCode || !deliveryAddress || !phone) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5555/api/delivery", {
                orderId: order.orderId,
                userId: order.userId,
                deliveryAddress,
                phone,
                postalCode,
                specialNotes
            });

            setSuccessMessage("Delivery request submitted successfully!");
            window.location.href="/my-customize-order";
            setErrorMessage("");
            console.log("Response:", response.data);
        } catch (error) {
            setErrorMessage("Failed to submit delivery request.");
            console.error("Error:", error);
        }
    };

    if (!order) {
        return <div className="text-center mt-5">Loading order details...</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Delivery Request</h1>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <div className="card shadow-lg">
                <div className="card-body">
                    <h5 className="card-title text-primary">Order Summary</h5>
                    <p><strong>Order ID:</strong> {order.orderId}</p>
                    <p><strong>User ID:</strong> {order.userId}</p>
                    <p><strong>Customer Name:</strong> {order.customerInfo.name}</p>
                    <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                    <p><strong>Email:</strong> {order.customerInfo.email}</p>
                    <p><strong>Total Price:</strong> LKR {order.totalPrice.toLocaleString()}</p>
                </div>
            </div>

            {/* Delivery Form */}
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="form-group">
                    <label>Delivery Address:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Postal Code:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Special Notes (Optional):</label>
                    <textarea
                        className="form-control"
                        rows="3"
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary mt-3">Submit Delivery Request</button>
            </form>
        </div>
    );
};

export default DeliveryRequest;
