import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import ManagerHeader from '../../components/managerHeader';

function StoreItems() {
  const [items, setItems] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Fetch all items from the StoreDatabase collection
        const response = await axios.get('http://localhost:5555/getAllItems');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems();
  }, []);

  return (
    <div>
      <ManagerHeader />
      <div className="container1 mt-4" style={{ userSelect: 'none' }}>
        <h2>Online Store Items</h2>
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
                    <img src={`data:image/jpeg;base64,${item.photo}`} alt="Item" style={{ width: '100px', height: 'auto' }} />
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete from Store
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Function to handle the delete action
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5555/store-database/delete/${id}`);
      setItems(items.filter(item => item._id !== id));
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };
}

export default StoreItems;
