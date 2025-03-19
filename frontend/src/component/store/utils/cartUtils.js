// utils/cartUtils.js
export const addToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
  
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
  };
  
  export const getCart = () => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  };
  
  export const removeFromCart = (itemId) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter((cartItem) => cartItem._id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };
  