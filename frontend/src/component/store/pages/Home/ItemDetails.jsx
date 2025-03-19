import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ItemDetails({ cart, setCart }) {
    const { itemId } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                // Fetch item details by ID
                const response = await axios.get(`http://localhost:5555/store-items/${itemId}`);
                if (!response.data) {
                    throw new Error('Item not found');
                }
                setItem(response.data); // Set the fetched item data
            } catch (error) {
                console.error('Error fetching item:', error);
                alert('Error fetching item details. Please try again later.');
            }
        };
    
        fetchItem();
    }, [itemId]);

    const handleAddToCart = () => {
        if (item.qty > 0) {
            const itemInCart = cart.find((cartItem) => cartItem._id === item._id);

            if (itemInCart) {
                if (itemInCart.quantity < item.qty) {
                    setCart(
                        cart.map((cartItem) =>
                            cartItem._id === item._id
                                ? { ...itemInCart, quantity: itemInCart.quantity + 1 }
                                : cartItem
                        )
                    );
                } else {
                    alert(`Cannot add more than ${item.qty} of ${item.name} to the cart.`);
                }
            } else {
                setCart([...cart, { ...item, quantity: 1 }]);
            }
        } else {
            alert('Item is out of stock');
        }
    };

    return (
        <div className="container py-4">
            <button
                className="btn btn-secondary mb-4"
                onClick={() => navigate(-1)}
            >
                Back
            </button>
            {item ? (
                <div className="row bg-white shadow-lg rounded overflow-hidden">
                    <div className="col-lg-6">
                        <img
                            src={`data:image/jpeg;base64,${item.photo}`}
                            alt={item.name}
                            className="img-fluid rounded"
                            style={{ maxHeight: '700px', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="col-lg-6 p-4">
                        <h2 className="h4 fw-bold mb-3">{item.name}</h2>
                        <p className="h5 text-primary mb-3">
                            Price: RS {item.price.toFixed(2)}
                        </p>
                        <p className="text-muted mb-3">
                            <strong>Available Quantity:</strong> {item.qty}
                        </p>
                        <p className="text-muted mb-4">
                            <strong>Description:</strong> {item.description}
                        </p>
                        <button
                            className="btn btn-primary px-4 py-2"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-center text-muted">Loading item details...</p>
            )}
        </div>
    );
}

export default ItemDetails;