import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../component/home/HomeHeader"; // Import the HomeHeader component
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal
import Swal from 'sweetalert2'; // Import SweetAlert

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
    const [error, setError] = useState(""); // State to store error messages

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

    // Payment validation functions
    const handleCardNumberChange = (e) => {
        const regex = /^\d{0,12}$/; // Only allow numbers and max length of 12
        if (regex.test(e.target.value)) {
            setCreditCardInfo({ ...creditCardInfo, cardNumber: e.target.value });
        }
    };

    const handleCvvChange = (e) => {
        const regex = /^\d{0,3}$/; // Only allow numbers and max length of 3
        if (regex.test(e.target.value)) {
            setCreditCardInfo({ ...creditCardInfo, cvv: e.target.value });
        }
    };

    const handleExpirationDateChange = (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2); // Insert '/' after MM
        }

        if (value.length === 5) {
            const month = parseInt(value.slice(0, 2));
            const year = parseInt('20' + value.slice(3, 5));

            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed

            // Check for invalid month
            if (month < 1 || month > 12) {
                setError('Invalid month. Please enter a valid expiration date.');
                return;
            }

            // Check for invalid year
            if (year < currentYear || year > currentYear + 4) {
                setError('Invalid year. Please enter a year between ' + currentYear + ' and ' + (currentYear + 4) + '.');
                return;
            }

            // Check for expiration based on current month
            if (year === currentYear && month < currentMonth) {
                setError('Expired date. Please enter a valid expiration date.');
                return;
            }

            setError(''); // Clear any previous error if the date is valid
        }

        setCreditCardInfo({ ...creditCardInfo, expiry: value });
    };

    const handleClear = () => {
        setCreditCardInfo({
            cardNumber: '',
            expiry: '',
            cvv: ''
        });
        setError(''); // Clear any error messages
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (paymentMethod === "credit-card" && (!creditCardInfo.cardNumber || !creditCardInfo.expiry || !creditCardInfo.cvv)) {
            Swal.fire({
                icon: 'error',
                title: 'Payment Information Required',
                text: 'Please fill in your credit card details.'
            });
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
            userId: "fakeUserId123",
            customerInfo
        };
    
        try {
            // Show processing payment message if credit card payment
            if (paymentMethod === "credit-card") {
                Swal.fire({
                    title: 'Processing Payment',
                    text: 'Please wait while we process your payment...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                // Simulate payment processing delay (you can remove this in production)
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
            
            // Send the order to backend
            const response = await axios.post("http://localhost:5555/api/customorders", orderData);
            
            // Show success notification based on payment method
            if (paymentMethod === "credit-card") {
                await Swal.fire({
                    icon: 'success',
                    title: 'Payment Successful',
                    text: `Payment of LKR ${totalPrice.toLocaleString()} has been processed successfully!`,
                    confirmButtonColor: '#0d6efd'
                });
            }
            
            // Show order success notification
            await Swal.fire({
                icon: 'success',
                title: 'Order Placed Successfully!',
                text: `Your order ${orderId} has been placed successfully. You will be redirected to the delivery details page.`,
                confirmButtonColor: '#0d6efd'
            });
            
            // Navigate to delivery details page
            window.location.href = `/delivery-detail/${orderId}`;
            
        } catch (error) {
            console.error("Error saving order:", error);
            
            Swal.fire({
                icon: 'error',
                title: 'Order Failed',
                text: 'Failed to place the order. Please try again.',
                confirmButtonColor: '#dc3545'
            });
        }
    };

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
        if (method === "credit-card") {
            // Reset credit card info before showing modal
            setCreditCardInfo({ cardNumber: "", expiry: "", cvv: "" });
            setError("");
            setShowPaymentModal(true);
        }
    };
    
    const handleSavePayment = () => {
        // Validate card details
        if (!creditCardInfo.cardNumber || !creditCardInfo.expiry || !creditCardInfo.cvv) {
            setError("Please fill in all card details");
            return;
        }
        
        if (creditCardInfo.cardNumber.length < 12) {
            setError("Card number must be at least 12 digits");
            return;
        }
        
        if (creditCardInfo.cvv.length < 3) {
            setError("CVV must be 3 digits");
            return;
        }
        
        // Close the modal if all validations pass
        setShowPaymentModal(false);
        
        // Show a small toast notification that card details are saved
        Swal.fire({
            icon: 'success',
            title: 'Card Details Saved',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });
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
                            <p className="text-muted">Order ID: <strong>{orderId}</strong></p>
    
                            <div className="row">
                                {/* Customer Info */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Name:</label>
                                    <input
    type="text"
    className="form-control"
    value={customerInfo.name}
    onChange={(e) => {
        const value = e.target.value;
        // Allow only letters (both lowercase and uppercase)
        if (/^[a-zA-Z\s]*$/.test(value)) {
            setCustomerInfo({ ...customerInfo, name: value });
        }
    }}
    required
/>

                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Address:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={customerInfo.address}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                <label className="form-label">Phone:</label>
<input
    type="text"
    className="form-control"
    value={customerInfo.phone}
    onChange={(e) => {
        const value = e.target.value;
        // Allow only digits and limit to 10 characters
        if (/^\d{0,10}$/.test(value)) {
            setCustomerInfo({ ...customerInfo, phone: value });
        }
    }}
    required
/>

                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={customerInfo.email}
                                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
    
                            <hr />
    
                            <div className="row">
                                {/* Toy Details */}
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Toy Type:</label>
                                    <select className="form-select" onChange={(e) => setToy(e.target.value)} required>
                                        <option value="">Select</option>
                                        <option value="bear">Bear</option>
                                        <option value="rabbit">Rabbit</option>
                                        <option value="cartoon">Cartoon Character</option>
                                        <option value="giraf">Giraf</option>
                                    </select>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Size:</label>
                                    <select className="form-select" onChange={(e) => setSize(e.target.value)} required>
                                        <option value="">Select</option>
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                        <option value="xl">Extra Large</option>
                                    </select>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Fabric:</label>
                                    <select className="form-select" onChange={(e) => setFabric(e.target.value)} required>
                                        <option value="">Select</option>
                                        <option value="plush">Plush</option>
                                        <option value="cotton">Cotton</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Color:</label>
                                    <select className="form-select" onChange={(e) => setColor(e.target.value)} required>
                                        <option value="">Select</option>
                                        <option value="single">Single Color</option>
                                        <option value="multiple">Multiple Colors</option>
                                    </select>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Custom Message:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter a custom message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                </div>
                            </div>
    
                            <hr />
    
                            <div className="row">
                                {/* Accessories */}
                                <div className="col-md-12 mb-3">
                                    <label className="form-label">Accessories:</label>
                                    <div className="d-flex flex-wrap">
                                        {["clothing", "bow", "hat", "lights", "sound"].map((accessory) => (
                                            <div className="form-check me-3" key={accessory}>
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value={accessory}
                                                    onChange={(e) =>
                                                        setAccessories(
                                                            e.target.checked
                                                                ? [...accessories, accessory]
                                                                : accessories.filter((acc) => acc !== accessory)
                                                        )
                                                    }
                                                />
                                                <label className="form-check-label text-capitalize">{accessory}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
    
                            <hr />
    
                            <div className="row">
                                {/* Delivery and Quantity */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Delivery Date:</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={deliveryDate}
                                        onChange={(e) => validateDeliveryDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
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
                            </div>
    
                            <hr />
    
                            <div className="row">
                                {/* Payment and Shipping */}
                                <div className="col-md-6 mb-3">
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
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">Shipping Method:</label>
                                    <select className="form-select" onChange={(e) => setShippingMethod(e.target.value)} required>
                                        <option value="">Select</option>
                                        <option value="standard">Standard</option>
                                        <option value="express">Express</option>
                                        
                                    </select>
                                </div>
                            </div>
    
                            <hr />
    
                            <div className="row">
                                {/* Total Price */}
                                <div className="col-md-12 text-center">
                                    <p className="fs-4 fw-bold">Total Price: LKR {totalPrice.toLocaleString()}</p>
                                </div>
                            </div>
    
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
                            value={creditCardInfo.cardNumber}
                            onChange={handleCardNumberChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Expiry Date:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="MM/YY"
                            value={creditCardInfo.expiry}
                            onChange={handleExpirationDateChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">CVV:</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter CVV"
                            value={creditCardInfo.cvv}
                            onChange={handleCvvChange}
                            required
                        />
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSavePayment}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
    
            {/* Footer */}
            <footer className="bg-primary text-white text-center py-3 mt-5">
                <p>&copy; 2023 My Store. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default CustomOrder;