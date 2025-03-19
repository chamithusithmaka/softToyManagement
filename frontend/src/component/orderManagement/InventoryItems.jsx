import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerHeader from './managerHeader';
import { FaSearch } from 'react-icons/fa';

function ItemList() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null); // For delete confirmation
  const navigate = useNavigate();

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

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5555/store-items/item/${itemId}`);
      setItems(items.filter(item => item._id !== itemId));
      setConfirmDelete(null);
      alert('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleUpdateItem = (itemId) => {
    navigate(`/updateItem/${itemId}`);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter items with quantity less than 4
  const lowQuantityItems = items.filter(item => item.qty < 4);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <ManagerHeader />

      {/* Main Content */}
      <div className="container-fluid" style={{ marginLeft: '16rem' }}>
        <div className="d-flex justify-content-between mb-4">
          <h2 className="fw-bold">Inventory Items</h2>
          <div className="position-relative">
            <input
              type="text"
              placeholder="Search by item name"
              className="form-control"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-secondary">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Code</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.code}</td>
                    <td>{item.description}</td>
                    <td>{item.qty}</td>
                    <td>LKR: {item.price.toFixed(2)}</td>
                    <td>
                      {item.photo && (
                        <img
                          src={`data:image/jpeg;base64,${item.photo}`}
                          alt={item.name}
                          className="img-thumbnail"
                          style={{ width: '64px', height: '64px' }}
                        />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">No items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Low Quantity Items Section */}
        {lowQuantityItems.length > 0 && (
          <div className="mt-4">
            <h3 className="text-danger fw-bold mb-3">Low Quantity Items</h3>
            <ul className="list-group">
              {lowQuantityItems.map(item => (
                <li key={item._id} className="list-group-item">
                  <span className="fw-bold">{item.name}</span> - Quantity: {item.qty}
                </li>
              ))}
            </ul>
          </div>
        )}

        {confirmDelete && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
            <div className="bg-white rounded shadow p-4">
              <h3 className="mb-3">Confirm Deletion</h3>
              <p>Are you sure you want to delete this item?</p>
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-danger me-2"
                  onClick={() => handleDeleteItem(confirmDelete)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemList;