import React from 'react';
import { Link } from 'react-router-dom';

const AdminHome = () => {
  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="row g-4">
        {/* Sales Manager Section */}
        <div className="col-md-6">
          <div className="card shadow-lg border-0 h-100">
            <Link to="/dashboard/inventory" className="text-decoration-none">
              <div className="card-body text-center">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '100px', height: '100px' }}>
                  <span className="fs-1">📊</span>
                </div>
                <h2 className="card-title text-dark fs-4 fw-bold mb-3">Inventory Manager</h2>
                <p className="card-text text-muted">
                  Manage inventory and performance analytics from here.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Online Store Section */}
        <div className="col-md-6">
          <div className="card shadow-lg border-0 h-100">
            <Link to="/Store" className="text-decoration-none">
              <div className="card-body text-center">
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '100px', height: '100px' }}>
                  <span className="fs-1">🛒</span>
                </div>
                <h2 className="card-title text-dark fs-4 fw-bold mb-3">Store</h2>
                <p className="card-text text-muted">
                  Explore the store and manage items.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Order Management Section */}
        <div className="col-md-6">
          <div className="card shadow-lg border-0 h-100">
            <Link to="/inventory" className="text-decoration-none">
              <div className="card-body text-center">
                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '100px', height: '100px' }}>
                  <span className="fs-1">📦</span>
                </div>
                <h2 className="card-title text-dark fs-4 fw-bold mb-3">Order Management</h2>
                <p className="card-text text-muted">
                  Track and manage customer orders efficiently.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Delivery Management Section */}
        <div className="col-md-6">
          <div className="card shadow-lg border-0 h-100">
            <Link to="/delivery" className="text-decoration-none">
              <div className="card-body text-center">
                <div className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '100px', height: '100px' }}>
                  <span className="fs-1">🚚</span>
                </div>
                <h2 className="card-title text-dark fs-4 fw-bold mb-3">Delivery Management</h2>
                <p className="card-text text-muted">
                  Manage delivery schedules and track shipments.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;