import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ManagerHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/deliveries?search=${searchQuery}`);
  };

  return (
    <div className="d-flex">
      {/* Sidebar Navigation */}
      <nav className="bg-dark text-white position-fixed top-0 start-0 vh-100 p-3 shadow-lg" style={{ width: '16rem' }}>
        <h4 className="text-center mb-4 fw-bold text-uppercase">Delivery Manager</h4>
        <div className="d-flex flex-column gap-3">
          <Link className="text-white text-decoration-none fw-semibold d-flex align-items-center p-2 rounded hover-bg-light" to="/admin-deliveries">
            <i className="fas fa-truck me-2"></i> Delivery Requests
          </Link>
          <Link className="text-white text-decoration-none fw-semibold d-flex align-items-center p-2 rounded hover-bg-light" to="/drivers/add">
            <i className="fas fa-user-plus me-2"></i> Add Drivers
          </Link>
          <Link className="text-white text-decoration-none fw-semibold d-flex align-items-center p-2 rounded hover-bg-light" to="/drivers">
            <i className="fas fa-users me-2"></i> Drivers
          </Link>
          <Link className="text-white text-decoration-none fw-semibold d-flex align-items-center p-2 rounded hover-bg-light" to="/drivers/reports">
            <i className="fas fa-chart-line me-2"></i> Reports
          </Link>
          <Link 
            className="text-white text-decoration-none fw-semibold d-flex align-items-center p-2 rounded hover-bg-light" 
            to="/request-production-orders"
          >
            <i className="fas fa-paper-plane me-2"></i> Request Production Orders
          </Link>
        </div>
      </nav>

      {/* Content Area */}
      <div className="flex-grow-1 ms-5 ps-5 pt-4" style={{ marginLeft: '16rem' }}>
        {/* Other content of your page goes here */}
      </div>
    </div>
  );
}

export default ManagerHeader;