import React from "react";
import { Link } from "react-router-dom";
import { FaUser, FaStore, FaHome, FaTools, FaPalette, FaRuler, FaSwatchbook } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const HomeHeader = () => {
  return (
    <header className="bg-primary text-white py-3 shadow-sm sticky-top">
      <div className="container">
        <div className="row align-items-center">
          {/* Logo */}
          <div className="col-lg-3 col-md-4 mb-2 mb-md-0">
            <Link to="/home" className="text-decoration-none d-flex align-items-center">
              <img 
                src="/logo.png" 
                alt="Logo"
                height="40"
                className="me-2"
                onError={(e) => {e.target.style.display = 'none'}} 
              />
              <h1 className="h4 fw-bold m-0 text-white">Soft Toy Production</h1>
            </Link>
          </div>
          
          {/* Navigation Links */}
          <div className="col-lg-9 col-md-8">
            <nav className="navbar navbar-expand-lg navbar-dark p-0">
              <button 
                className="navbar-toggler" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav"
                aria-controls="navbarNav" 
                aria-expanded="false" 
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto gap-2">
                  <li className="nav-item">
                    <Link to="/home" className="nav-link px-3 py-2 rounded-pill d-flex align-items-center">
                      <FaHome className="me-2" /> <span>Home</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/store" className="nav-link px-3 py-2 rounded-pill d-flex align-items-center">
                      <FaStore className="me-2" /> <span>Store</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/customize-order" className="nav-link px-3 py-2 rounded-pill d-flex align-items-center">
                      <FaTools className="me-2" /> <span>Customize</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/my-customize-order" className="nav-link px-3 py-2 rounded-pill d-flex align-items-center">
                      <FaUser className="me-2" /> <span>My Orders</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/production-catalog" className="nav-link px-3 py-2 rounded-pill d-flex align-items-center">
                      <FaPalette className="me-2" /> <span>Catalog</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/size-chart" className="nav-link px-3 py-2 rounded-pill d-flex align-items-center">
                      <FaRuler className="me-2" /> <span>Size Charts</span>
                    </Link>
                  </li>
                  
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;