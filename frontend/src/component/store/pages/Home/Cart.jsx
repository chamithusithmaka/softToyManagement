import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';

function Cart({ cart, setCart }) {
  const handleRemoveFromCart = (item) => {
    setCart(cart.filter((cartItem) => cartItem._id !== item._id));
  };

  const handleQuantityChange = (item, change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      handleRemoveFromCart(item);
    } else if (newQuantity <= item.qty) {
      setCart(
        cart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        )
      );
    } else {
      alert(`Cannot add more than ${item.qty} of ${item.name} to the cart.`);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="container my-5">
      {/* Title */}
      <h2 className="text-center mb-4">Your Shopping Cart</h2>

      {/* Cart Content */}
      {cart.length === 0 ? (
        <p className="text-center text-muted">Your cart is empty.</p>
      ) : (
        <div>
          {/* Cart Items */}
          {cart.map((item) => (
            <div key={item._id} className="card mb-3">
              <div className="row g-0">
                {/* Item Image */}
                <div className="col-md-4">
                  <img
                    src={`data:image/jpeg;base64,${item.photo}`}
                    className="img-fluid rounded-start"
                    alt={item.name}
                  />
                </div>

                {/* Item Details */}
                <div className="col-md-5">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">
                      <strong>Price: LKR {item.price.toFixed(2)}</strong>
                    </p>
                    <p className="card-text text-muted">Available: {item.qty}</p>
                  </div>
                </div>

                {/* Quantity Control and Remove Button */}
                <div className="col-md-3 d-flex flex-column justify-content-center align-items-center">
                  <div className="d-flex align-items-center mb-3">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(item, -1)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleQuantityChange(item, 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleRemoveFromCart(item)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Total and Checkout */}
          <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-4">
            <h4>Total: LKR {getTotalPrice()}</h4>
            <Link to="/checkout" className="btn btn-primary">
              Checkout
            </Link>
          </div>
        </div>
      )}

      {/* Continue Shopping Button */}
      <div className="text-center mt-4">
        <Link to="/store" className="btn btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default Cart;