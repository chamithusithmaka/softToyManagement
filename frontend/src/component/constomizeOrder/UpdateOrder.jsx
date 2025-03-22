import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../home/HomeHeader"; // Import the HomeHeader component
import { useParams, useNavigate } from "react-router-dom";

const UpdateOrder = () => {
    const { orderId } = useParams(); // Get the order ID from the URL
    const [order, setOrder] = useState(null);
    const [fabricOptions, setFabricOptions] = useState([]); // Store fabric options
    const [accessoryOptions, setAccessoryOptions] = useState([]); // Store accessory options
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

    // Fetch fabric and accessory options
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                // Fetch fabric options
                const fabricResponse = await axios.get("http://localhost:5555/inventory-items/category/Fabric");
                setFabricOptions(fabricResponse.data.map((item) => item.name));

                // Fetch accessory options
                const accessoryResponse = await axios.get("http://localhost:5555/inventory-items/category/Accessories");
                setAccessoryOptions(accessoryResponse.data.map((item) => item.name));
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };

        fetchOptions();
    }, []);

    // Calculate total price dynamically
    useEffect(() => {
        if (order) {
            let price = 0;

            // Base price for toy type
            const toyPrices = { bear: 2500, rabbit: 2200, cartoon: 3000 };
            if (order.toyType) price += toyPrices[order.toyType];

            // Size multiplier
            const sizeMultipliers = { small: 1.0, medium: 1.2, large: 1.5, xl: 2.0 };
            if (order.size) price *= sizeMultipliers[order.size];

            // Fabric cost
            if (order.fabric) price += 800; // Example fixed cost for fabric

            // Color cost
            if (order.color === "multiple") price += 1000;

            // Custom message cost
            if (order.message?.includes("name")) price += 500;
            if (order.message?.includes("special")) price += 700;

            // Accessories cost
            const accessoryPrices = { clothing: 1000, bow: 500, hat: 700, lights: 1500, sound: 2000 };
            order.accessories.forEach((acc) => (price += accessoryPrices[acc] || 0));

            // Multiply by quantity
            price *= order.quantity;

            setOrder((prevOrder) => ({ ...prevOrder, totalPrice: price }));
        }
    }, [order?.toyType, order?.size, order?.fabric, order?.color, order?.message, order?.accessories, order?.quantity]);

    // Validate delivery date
    const validateDeliveryDate = (date) => {
        const today = new Date();
        const selectedDate = new Date(date);
        const difference = (selectedDate - today) / (1000 * 60 * 60 * 24);
        if (difference < 2) {
            alert("We can't prepare the toy within 2 days. Please select another date.");
            setOrder((prevOrder) => ({ ...prevOrder, deliveryDate: "" }));
        } else {
            setOrder((prevOrder) => ({ ...prevOrder, deliveryDate: date }));
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.patch(`http://localhost:5555/api/costomorders/${orderId}`, order);
            setSuccessMessage("Order updated successfully!");
            setErrorMessage("");
            console.log("Updated order:", response.data);
            navigate("/my-customize-order"); // Redirect to the orders page
        } catch (error) {
            console.error("Error updating order:", error);
            setErrorMessage("Failed to update order. Please try again.");
            setSuccessMessage("");
        }
    };

    // Handle accessory checkbox changes
    const handleAccessoryChange = (accessory) => {
        if (order.accessories.includes(accessory)) {
            setOrder({
                ...order,
                accessories: order.accessories.filter((acc) => acc !== accessory),
            });
        } else {
            setOrder({
                ...order,
                accessories: [...order.accessories, accessory],
            });
        }
    };

    return (
        <div>
            <Header />
            <div className="container mt-5">
                <h2 className="text-center mb-4">Update Order</h2>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                {order ? (
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* Toy Type */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Toy Type:</label>
                                <select
                                    className="form-select"
                                    value={order.toyType}
                                    onChange={(e) => setOrder({ ...order, toyType: e.target.value })}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="bear">Bear</option>
                                    <option value="rabbit">Rabbit</option>
                                    <option value="cartoon">Cartoon Character</option>
                                </select>
                            </div>

                            {/* Size */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Size:</label>
                                <select
                                    className="form-select"
                                    value={order.size}
                                    onChange={(e) => setOrder({ ...order, size: e.target.value })}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                    <option value="xl">Extra Large</option>
                                </select>
                            </div>

                            {/* Fabric */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Fabric:</label>
                                <select
                                    className="form-select"
                                    value={order.fabric}
                                    onChange={(e) => setOrder({ ...order, fabric: e.target.value })}
                                    required
                                >
                                    <option value="">Select</option>
                                    {fabricOptions.map((fabric, index) => (
                                        <option key={index} value={fabric}>
                                            {fabric}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Color */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Color:</label>
                                <select
                                    className="form-select"
                                    value={order.color}
                                    onChange={(e) => setOrder({ ...order, color: e.target.value })}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="single">Single Color</option>
                                    <option value="multiple">Multiple Colors</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div className="col-md-12 mb-3">
                                <label className="form-label">Custom Message:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={order.message || ""}
                                    onChange={(e) => setOrder({ ...order, message: e.target.value })}
                                    placeholder="Enter a custom message"
                                />
                            </div>

                            {/* Accessories */}
                            <div className="col-md-12 mb-3">
                                <label className="form-label">Accessories:</label>
                                <div className="d-flex flex-wrap">
                                    {accessoryOptions.map((accessory, index) => (
                                        <div className="form-check me-3" key={index}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={order.accessories.includes(accessory)}
                                                onChange={() => handleAccessoryChange(accessory)}
                                            />
                                            <label className="form-check-label">{accessory}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Delivery Date */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Delivery Date:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={order.deliveryDate.split("T")[0]} // Format date for input
                                    onChange={(e) => validateDeliveryDate(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Quantity */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Quantity:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={order.quantity}
                                    min="1"
                                    onChange={(e) => setOrder({ ...order, quantity: parseInt(e.target.value) })}
                                    required
                                />
                            </div>

                            {/* Total Price */}
                            <div className="col-md-12 mb-3">
                                <label className="form-label">Total Price (LKR):</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={order.totalPrice}
                                    readOnly
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">
                            Update Order
                        </button>
                    </form>
                ) : (
                    <p className="text-center">Loading order details...</p>
                )}
            </div>
        </div>
    );
};

export default UpdateOrder;