import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaClipboardList, FaBoxOpen, FaTimesCircle, FaCheckCircle, FaChartLine, FaSearch } from 'react-icons/fa';

function AdminSideBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/items?search=${searchQuery}`);
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      {/* Sidebar Navigation */}
      <nav className="bg-white shadow border-end position-fixed top-0 start-0 h-100 p-4" style={{ width: '16rem' }}>
        <h1 className="text-center fs-4 fw-bold text-dark mb-4">Customize Orders Admin Dashboard</h1>
        <div className="d-flex flex-column">
          

          {/* All Custom Orders */}
          <Link className="d-flex align-items-center text-dark text-decoration-none mb-3 p-2 rounded hover-bg-light" to="/all-custom-orders">
            <FaBoxOpen className="me-2" /> All Custom Orders
          </Link>

          {/* On Delivery Orders */}
          {/* 
          {/* Sales Report */}
          <Link className="d-flex align-items-center text-dark text-decoration-none mb-3 p-2 rounded hover-bg-light" to="/custom-order-report">
            <FaChartLine className="me-2" /> Sales Report
          </Link>

          
        </div>
      </nav>
    </div>
  );
}

export default AdminSideBar;