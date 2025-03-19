import React, { useState, useEffect } from "react";

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
    const [totalPrice, setTotalPrice] = useState(0);

    // Auto-generate order ID
    useEffect(() => {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        setOrderId(`ORDER${randomNum}`);
    }, []);

    // Calculate price
    useEffect(() => {
        let price = 0;

        // Base price
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

    return (
        <div className="p-6 bg-white shadow-lg rounded-xl max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Custom Order Form</h2>

            <p>Order ID: <strong>{orderId}</strong></p>

            <label>Toy Type:</label>
            <select className="border p-2 w-full" onChange={(e) => setToy(e.target.value)}>
                <option value="">Select</option>
                <option value="bear">Bear</option>
                <option value="rabbit">Rabbit</option>
                <option value="cartoon">Cartoon Character</option>
            </select>

            <label>Size:</label>
            <select className="border p-2 w-full" onChange={(e) => setSize(e.target.value)}>
                <option value="">Select</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xl">Extra Large</option>
            </select>

            <label>Fabric:</label>
            <select className="border p-2 w-full" onChange={(e) => setFabric(e.target.value)}>
                <option value="">Select</option>
                <option value="plush">Plush</option>
                <option value="cotton">Cotton</option>
            </select>

            <label>Delivery Date:</label>
            <input type="date" className="border p-2 w-full" onChange={(e) => validateDeliveryDate(e.target.value)} />

            <label>Quantity:</label>
            <input type="number" className="border p-2 w-full" value={quantity} min="1" onChange={(e) => setQuantity(parseInt(e.target.value))} />

            <p className="mt-4 text-lg font-bold">Total Price: LKR {totalPrice.toLocaleString()}</p>
        </div>
    );
};

export default CustomOrder;
