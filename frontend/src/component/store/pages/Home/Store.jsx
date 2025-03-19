import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Notification from '../../components/Notification'; // Import the Notification component
import Header from '../../../home/HomeHeader'; // Import the HomeHeader component

function Store({ cart, setCart }) {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState(null); // State to control notification visibility

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5555/store-items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  const handleAddToCart = (item) => {
    if (item.qty > 0) {
      const itemInCart = cart?.find((cartItem) => cartItem._id === item._id);

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
          setNotification(`Cannot add more than ${item.qty} of ${item.name} to the cart.`);
        }
      } else {
        setCart([...cart, { ...item, quantity: 1 }]);
      }
    } else {
      setNotification('This item is out of stock.');
    }
  };

  const handleCloseNotification = () => {
    setNotification(null); // Close the notification
  };

  return (
    <div>
      {/* Add the HomeHeader component */}
      <Header />

      <div className="container py-5">
        {notification && (
          <Notification message={notification} onClose={handleCloseNotification} />
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fw-bold">Welcome to Store</h1>
          <div className="d-flex gap-3">
            <Link to="/cart" className="btn btn-secondary">
              Cart
            </Link>
            <Link to="/my-orders" className="btn btn-secondary">
              My Orders
            </Link>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search items by name"
            value={searchQuery}
            onChange={handleSearch}
            className="form-control"
          />
        </div>

        <div className="row g-4">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className={`col-md-4 ${item.qty === 0 ? 'bg-light' : ''}`}
            >
              <div className="card shadow-sm h-100">
                <Link to={`/store-items/${item._id}`}>
                  <img
                    src={`data:image/jpeg;base64,${item.photo}`}
                    alt={item.name}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                </Link>
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">
                    <strong>RS: {item.price.toFixed(2)}</strong>
                  </p>
                  <p className="card-text">Available: {item.qty}</p>
                  <button
                    className={`btn w-100 ${
                      item.qty === 0 ? 'btn-secondary disabled' : 'btn-primary'
                    }`}
                    onClick={() => handleAddToCart(item)}
                    disabled={item.qty === 0} // Disable button for out-of-stock items
                  >
                    {item.qty === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Store;