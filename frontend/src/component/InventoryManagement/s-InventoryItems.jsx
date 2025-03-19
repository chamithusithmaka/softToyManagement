import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ManagerHeader from '../InventoryManagement/managerHeader';

const SenuraInventoryItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); // For displaying filtered results
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // To store the search query

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5555/inventory-items');
        setItems(response.data);
        setFilteredItems(response.data); // Initialize filtered items
        setLoading(false);
      } catch (error) {
        setError('Error fetching inventory items');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter items based on the search query
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center mt-4">{error}</div>;
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <ManagerHeader />

      {/* Main Content */}
      <div className="container-fluid" style={{ marginLeft: '16rem' }}>
        <div className="row justify-content-center mt-4">
          <div className="col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="text-center">Inventory Items</h1>
              <input
                type="text"
                placeholder="Search items by name"
                className="form-control w-50"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            <div className="row g-4">
              {filteredItems.map((item) => (
                <div key={item._id} className="col-md-6 col-lg-4">
                  <div className="card h-100 shadow-sm">
                    <Link to={`/items/${item._id}`} className="text-decoration-none">
                      {item.photo && (
                        <img
                          src={`data:image/jpeg;base64,${item.photo}`}
                          className="card-img-top"
                          alt={item.name}
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title text-dark">{item.name}</h5>
                        <p className="card-text text-muted">Price: LKR {item.price.toFixed(2)}</p>
                        <p className="card-text text-muted">Quantity Available: {item.qty}</p>
                        <p className="card-text text-muted">
                          <strong>Company:</strong> {item.companyName}
                        </p>
                        <p className="card-text text-muted">
                          <strong>Category:</strong> {item.category?.name || 'N/A'}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SenuraInventoryItems;