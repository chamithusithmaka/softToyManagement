import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function ItemList() {
  const [items, setItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);


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

  const handleAddToStore = (itemId) => {
    navigate(`/update-description/${itemId}`);
  };

  return (
    <div className="container1 mt-4">
      <h2>Item List</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Code</th>
            <th scope="col">Description</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price</th>
            <th scope="col">Photo</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{item.name}</td>
              <td>{item.code}</td>
              <td>{item.description}</td>
              <td>{item.qty}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                {item.photo && (
                  <img src={item.photo} alt="Item" style={{ width: '100px', height: 'auto' }} />
                )}
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddToStore(item._id)}
                >
                  Add to Store
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ItemList;
