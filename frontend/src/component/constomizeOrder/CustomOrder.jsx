import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../component/home/HomeHeader"; // Import the HomeHeader component
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal

const CustomOrder = () => {
    const [orderId, setOrderId] = useState("");
    const [toy, setToy] = useState("");
    const [size, setSize] = useState("");
    const [fabric, setFabric] = useState("");
    const [color, setColor] = useState("");
    const [message, setMessage] = useState("");
    const [accessories, setAccessories] = useState([]);
    const [deliveryDate, setDeliveryDate] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [shippingMethod, setShippingMethod] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [creditCardInfo, setCreditCardInfo] = useState({ cardNumber: "", expiry: "", cvv: "" });
    const [customerInfo, setCustomerInfo] = useState({ name: "", address: "", phone: "", email: "" });
    const [totalPrice, setTotalPrice] = useState(0);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false); // State to control modal visibility

    // Auto-generate order ID
    useEffect(() => {
        const randomNum = Math.floor(1 + Math.random() * 999).toString().padStart(3, "0");
        setOrderId(`ORDER${randomNum}`);
    }, []);

    // Calculate price dynamically
    useEffect(() => {
        let price = 0;

        // Base price for toy type
        const toyPrices = { bear: 2500, rabbit: 2200, cartoon: 3000 };
        if (toy) price += toyPrices[toy];

        // Size multiplier
        const sizeMultipliers = { small: 1.0, medium: 1.2, large: 1.5, xl: 2.0 };
        if (size) price *= sizeMultipliers[size];

        // Fabric cost
        const fabricPrices = { plush: 800, cotton: 500 };
        if (fabric) price += fabricPrices[fabric];

        // Color cost
        if (color === "multiple") price += 1000;

        // Custom message cost
        if (message.includes("name")) price += 500;
        if (message.includes("special")) price += 700;

        // Accessories cost
        const accessoryPrices = { clothing: 1000, bow: 500, hat: 700, lights: 1500, sound: 2000 };
        accessories.forEach(acc => price += accessoryPrices[acc]);

        // Shipping cost
        const shippingPrices = { standard: 500, express: 1000, international: 5000 };
        if (shippingMethod) price += shippingPrices[shippingMethod];

        // Multiply by quantity
        price *= quantity;

        setTotalPrice(price);
    }, [toy, size, fabric, color, message, accessories, quantity, shippingMethod]);

    // Validate delivery date
    const validateDeliveryDate = (date) => {
        const today = new Date();
        const selectedDate = new Date(date);
        const difference = (selectedDate - today) / (1000 * 60 * 60 * 24);
        if (difference < 2) {
            alert("We can't prepare the toy within 2 days. Please select another date.");
            setDeliveryDate("");
        } else {
            setDeliveryDate(date);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (paymentMethod === "credit-card" && (!creditCardInfo.cardNumber || !creditCardInfo.expiry || !creditCardInfo.cvv)) {
            alert("Please fill in your credit card details.");
            return;
        }

        const orderData = {
            orderId,
            toyType: toy,
            size,
            fabric,
            color,
            message,
            accessories,
            deliveryDate,
            quantity,
            totalPrice,
            paymentMethod,
            shippingMethod,
            creditCardInfo: paymentMethod === "credit-card" ? creditCardInfo : null,
            userId: "fakeUserId123", // Use a fake user ID until the user model is implemented
            customerInfo // Include customerInfo in the request
        };

        try {
            const response = await axios.post("http://localhost:5555/api/customorders", orderData);
            setSuccessMessage("Order placed successfully!");
            setErrorMessage("");
            console.log("Order saved:", response.data);
        } catch (error) {
            setErrorMessage("Failed to place the order. Please try again.");
            setSuccessMessage("");
            console.error("Error saving order:", error);
        }
    };

    // Handle payment method change
    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
        if (method === "credit-card") {
            setShowPaymentModal(true); // Show modal for credit card details
        }
    };

    return (
        <div>
            <Header />
            <div className="container mt-5">
                <div className="card shadow-lg">
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Custom Order Form</h2>

                        {successMessage && <div className="alert alert-success">{successMessage}</div>}
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                        <form onSubmit={handleSubmit}>
                            <p>Order ID: <strong>{orderId}</strong></p>

                            {/* Customer Info */}
                            <div className="mb-3">
                                <label className="form-label">Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Address:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={customerInfo.address}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={customerInfo.phone}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email:</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={customerInfo.email}
                                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Toy Type */}
                            <div className="mb-3">
                                <label className="form-label">Toy Type:</label>
                                <select className="form-select" onChange={(e) => setToy(e.target.value)} required>
                                    <option value="">Select</option>
                                    <option value="bear">Bear</option>
                                    <option value="rabbit">Rabbit</option>
                                    <option value="cartoon">Cartoon Character</option>
                                </select>
                            </div>

                            {/* Size */}
                            <div className="mb-3">
                                <label className="form-label">Size:</label>
                                <select className="form-select" onChange={(e) => setSize(e.target.value)} required>
                                    <option value="">Select</option>
                                    <option value="small">Small</option>
                                    <option value="medium">Medium</option>
                                    <option value="large">Large</option>
                                    <option value="xl">Extra Large</option>
                                </select>
                            </div>

                            {/* Fabric */}
                            <div className="mb-3">
                                <label className="form-label">Fabric:</label>
                                <select className="form-select" onChange={(e) => setFabric(e.target.value)} required>
                                    <option value="">Select</option>
                                    <option value="plush">Plush</option>
                                    <option value="cotton">Cotton</option>
                                </select>
                            </div>

                            {/* Color */}
                            <div className="mb-3">
                                <label className="form-label">Color:</label>
                                <select className="form-select" onChange={(e) => setColor(e.target.value)} required>
                                    <option value="">Select</option>
                                    <option value="single">Single Color</option>
                                    <option value="multiple">Multiple Colors</option>
                                </select>
                            </div>

                            {/* Message */}
                            <div className="mb-3">
                                <label className="form-label">Custom Message:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter a custom message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            {/* Accessories */}
                            <div className="mb-3">
                                <label className="form-label">Accessories:</label>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="clothing"
                                        onChange={(e) => setAccessories([...accessories, e.target.value])}
                                    />
                                    <label className="form-check-label">Clothing</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="bow"
                                        onChange={(e) => setAccessories([...accessories, e.target.value])}
                                    />
                                    <label className="form-check-label">Bow</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="hat"
                                        onChange={(e) => setAccessories([...accessories, e.target.value])}
                                    />
                                    <label className="form-check-label">Hat</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="lights"
                                        onChange={(e) => setAccessories([...accessories, e.target.value])}
                                    />
                                    <label className="form-check-label">Lights</label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        value="sound"
                                        onChange={(e) => setAccessories([...accessories, e.target.value])}
                                    />
                                    <label className="form-check-label">Sound Module</label>
                                </div>
                            </div>

                            {/* Delivery Date */}
                            <div className="mb-3">
                                <label className="form-label">Delivery Date:</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={deliveryDate}
                                    onChange={(e) => validateDeliveryDate(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Quantity */}
                            <div className="mb-3">
                                <label className="form-label">Quantity:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={quantity}
                                    min="1"
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    required
                                />
                            </div>

                            {/* Payment Method */}
                            <div className="mb-3">
                                <label className="form-label">Payment Method:</label>
                                <select
                                    className="form-select"
                                    onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="credit-card">Credit Card</option>
                                    <option value="cash-on-delivery">Cash on Delivery</option>
                                </select>
                            </div>

                            {/* Shipping Method */}
                            <div className="mb-3">
                                <label className="form-label">Shipping Method:</label>
                                <select className="form-select" onChange={(e) => setShippingMethod(e.target.value)} required>
                                    <option value="">Select</option>
                                    <option value="standard">Standard</option>
                                    <option value="express">Express</option>
                                    <option value="international">International</option>
                                </select>
                            </div>

                            <p className="mt-4 fs-5 fw-bold">Total Price: LKR {totalPrice.toLocaleString()}</p>

                            <button type="submit" className="btn btn-primary w-100">Place Order</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter Credit Card Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Card Number:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter card number"
                            onChange={(e) => setCreditCardInfo({ ...creditCardInfo, cardNumber: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Expiry Date:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="MM/YY"
                            onChange={(e) => setCreditCardInfo({ ...creditCardInfo, expiry: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">CVV:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter CVV"
                            onChange={(e) => setCreditCardInfo({ ...creditCardInfo, cvv: e.target.value })}
                            required
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => setShowPaymentModal(false)}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CustomOrder;