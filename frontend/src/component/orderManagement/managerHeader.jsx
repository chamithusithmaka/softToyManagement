import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaClipboardList, FaBoxOpen,FaEnvelope, FaTimesCircle, FaCheckCircle, FaChartLine, FaSearch } from 'react-icons/fa';

function ManagerHeader() {
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
        <h1 className="text-center fs-4 fw-bold text-dark mb-4">Manager Dashboard</h1>
        <div className="d-flex flex-column">
          <Link className="d-flex align-items-center text-dark text-decoration-none mb-3 p-2 rounded hover-bg-light" to="/inventory">
            <FaBoxOpen className="me-2" /> Inventory
          </Link>
          <Link className="d-flex align-items-center text-dark text-decoration-none mb-3 p-2 rounded hover-bg-light" to="/orderlist">
            <FaClipboardList className="me-2" /> All Orders
          </Link>
          <Link className="d-flex align-items-center text-dark text-decoration-none mb-3 p-2 rounded hover-bg-light" to="/pending">
            <FaTimesCircle className="me-2" /> Pending Orders
          </Link>
          <Link className="d-flex align-items-center text-dark text-decoration-none mb-3 p-2 rounded hover-bg-light" to="/cancel">
            <FaTimesCircle className="me-2" /> Cancelled Orders
          </Link>
          <Link className="d-flex align-items-center text-dark text-decoration-none mb-3 p-2 rounded hover-bg-light" to="/finish">
            <FaCheckCircle className="me-2" /> Finished Orders
          </Link>
          <Link className="d-flex align-items-center text-dark text-decoration-none mb-3 p-2 rounded hover-bg-light" to="/report">
            <FaChartLine className="me-2" /> Report
          </Link>
          <Link className="d-flex align-items-center text-dark text-decoration-none mb-3 p-2 rounded hover-bg-light" to="/email">
            <FaEnvelope className="me-2" /> Email
          </Link>
        </div>

        
      </nav>
    </div>
  );
}

export default ManagerHeader;