import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ManagerHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/items?search=${searchQuery}`);
  };

  return (
    <div className="d-flex">
      {/* Sidebar Navigation */}
      <nav className="bg-dark text-white position-fixed top-0 start-0 vh-100 p-3 shadow-lg" style={{ width: '16rem' }}>
        <h4 className="text-center mb-4 fw-bold text-uppercase">Manager Panel</h4>
        <div className="d-flex flex-column gap-3">
          <Link className="text-white text-decoration-none fw-semibold d-flex align-items-center p-2 rounded hover-bg-light" to="/dashboard/inventory">
            <i className="fas fa-boxes me-2"></i> Inventory
          </Link>
          <Link className="text-white text-decoration-none fw-semibold d-flex align-items-center p-2 rounded hover-bg-light" to="/dashboard/catagory">
            <i className="fas fa-tags me-2"></i> Category
          </Link>
          <Link className="text-white text-decoration-none fw-semibold d-flex align-items-center p-2 rounded hover-bg-light" to="/dashboard/addcatagory">
            <i className="fas fa-plus-circle me-2"></i> Add Category
          </Link>
          <Link className="text-white text-decoration-none fw-semibold d-flex align-items-center p-2 rounded hover-bg-light" to="/dashboard/summery">
            <i className="fas fa-chart-bar me-2"></i> Report
          </Link>
          <Link className="text-white text-decoration-none fw-semibold d-flex align-items-center p-2 rounded hover-bg-light" to="/dashboard/additem">
            <i className="fas fa-plus me-2"></i> Add Item
          </Link>
          <Link className="text-white text-decoration-none fw-semibold d-flex align-items-center p-2 rounded hover-bg-light" to="/Store">
            <i className="fas fa-store me-2"></i> Store
          </Link>
        </div>

        {/* Search Bar */}
        
      </nav>

      {/* Content Area */}
      <div className="flex-grow-1 ms-5 ps-5 pt-4" style={{ marginLeft: '16rem' }}>
        {/* Other content of your page goes here */}
      </div>
    </div>
  );
}

export default ManagerHeader;