import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Checkout({ cart, setCart }) {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userProfile, setUserProfile] = useState(null); // Fake user profile
  const navigate = useNavigate();

  // Add fake user to localStorage if not already present
  useEffect(() => {
    const fakeUser = JSON.parse(localStorage.getItem('user'));
    if (!fakeUser) {
      const newFakeUser = {
        userId: '12345', // Fake user ID
        name: 'John Doe',
        email: 'johndoe@example.com'
      };
      localStorage.setItem('user', JSON.stringify(newFakeUser));
      setUserProfile(newFakeUser);
    } else {
      setUserProfile(fakeUser);
    }
  }, []);

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    setLoading(true);

    try {
      if (!userProfile?.userId) throw new Error('User ID is not available.');

      const orderData = {
        customerInfo,
        items: cart.map(item => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        paymentInfo,
        totalAmount: cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2),
        userId: userProfile.userId // Pass the fake user ID
      };

      // Send order data to the server
      await axios.post(`http://localhost:5555/api/orders`, orderData);
      setCart([]);
      alert('Order placed successfully!');

      // Navigate to store after placing the order
      navigate('/store');
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/cart');
  };

  const validateInputs = () => {
    if (!customerInfo.name || !customerInfo.address || !customerInfo.phone || !customerInfo.email) {
      setError('Please fill in all customer information fields.');
      return false;
    }
    if (!paymentInfo.cardNumber || !paymentInfo.expirationDate || !paymentInfo.cvv) {
      setError('Please fill in all payment information fields.');
      return false;
    }
    if (!/^\d{12}$/.test(paymentInfo.cardNumber)) {
      setError('Please enter a valid card number.');
      return false;
    }
    setError('');
    return true;
  };

  const handleNameChange = (e) => {
    const regex = /^[A-Za-z\s]*$/; // Only allow letters and spaces
    if (regex.test(e.target.value)) {
      setCustomerInfo({ ...customerInfo, name: e.target.value });
    }
  };

  const handlePhoneChange = (e) => {
    const regex = /^\d{0,10}$/; // Only allow numbers and max length of 10
    if (regex.test(e.target.value)) {
      setCustomerInfo({ ...customerInfo, phone: e.target.value });
    }
  };

  const handleCardNumberChange = (e) => {
    const regex = /^\d{0,12}$/; // Only allow numbers and max length of 12
    if (regex.test(e.target.value)) {
      setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value });
    }
  };

  const handleCvvChange = (e) => {
    const regex = /^\d{0,3}$/; // Only allow numbers and max length of 3
    if (regex.test(e.target.value)) {
      setPaymentInfo({ ...paymentInfo, cvv: e.target.value });
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

    setPaymentInfo({ ...paymentInfo, expirationDate: value });
  };

  const handleClear = () => {
    setPaymentInfo({
      cardNumber: '',
      expirationDate: '',
      cvv: ''
    });
    setError(''); // Clear any error messages
  };

  return (
    <div className="container my-5">
      {/* Title */}
      <h2 className="text-center mb-4">Checkout</h2>

      {/* Customer Information */}
      <div className="bg-light p-4 rounded mb-4">
        <h4 className="mb-3">Customer Information</h4>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              placeholder="Name"
              value={customerInfo.name}
              onChange={handleNameChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              placeholder="Phone"
              value={customerInfo.phone}
              onChange={handlePhoneChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="email"
              placeholder="Email"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="col-md-6 mb-3">
            <input
              type="text"
              placeholder="Address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-light p-4 rounded mb-4">
        <h4 className="mb-3">Payment Information</h4>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input
              type="text"
              placeholder="Card Number"
              value={paymentInfo.cardNumber}
              onChange={handleCardNumberChange}
              className="form-control"
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="text"
              placeholder="MM/YY"
              value={paymentInfo.expirationDate}
              onChange={handleExpirationDateChange}
              className="form-control"
            />
          </div>
          <div className="col-md-3 mb-3">
            <input
              type="password"
              placeholder="CVV"
              value={paymentInfo.cvv}
              onChange={handleCvvChange}
              className="form-control"
            />
          </div>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button onClick={handleClear} className="btn btn-danger">
          Clear Payment Details
        </button>
      </div>

      {/* Order Summary */}
      <div className="bg-light p-4 rounded mb-4">
        <h4 className="mb-3">Order Summary</h4>
        <ul className="list-group mb-3">
          {cart.map((item) => (
            <li key={item._id} className="list-group-item d-flex justify-content-between">
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>LKR {item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <h5>Total: LKR {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</h5>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between">
        <button onClick={handleCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button onClick={handleSubmit} className="btn btn-primary">
          Place Order
        </button>
      </div>
    </div>
  );
}

export default Checkout;