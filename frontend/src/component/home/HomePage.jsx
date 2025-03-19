import React from "react";
import Header from "./HomeHeader";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div style={{ backgroundColor: "#FFF5E1" }}>
      <Header />

      {/* Hero Section */}
      <div className="position-relative overflow-hidden p-5 text-center" 
           style={{ backgroundColor: "#FFB6C1", minHeight: "60vh" }}>
        <div className="col-md-8 mx-auto my-5">
          <h1 className="display-4 fw-bold text-white mb-4">Welcome to Teddy's Haven</h1>
          <p className="lead fw-normal text-white mb-4">
            Discover a world of cuddly companions and create lasting memories with our premium soft toys.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Link to="/store" className="btn btn-lg px-4 py-3 shadow-sm rounded-pill"
                  style={{ backgroundColor: "#FFD700", color: "#5D5D5D" }}>
              Browse Store
            </Link>
            <Link to="/customize" className="btn btn-lg px-4 py-3 btn-outline-light rounded-pill">
              Customize Now
            </Link>
          </div>
        </div>
      </div>

      <main className="container my-5">
        

        {/* Custom Orders Section */}
        <section className="py-5 my-5 rounded-4 text-center p-5"
                 style={{ backgroundColor: "#87CEEB" }}>
          <h2 className="text-white mb-4">Create Your Perfect Companion</h2>
          <p className="lead text-white mb-4">
            Design your dream soft toy with our customization options. Choose colors, sizes, and add personal touches!
          </p>
          <Link to="/customize" className="btn btn-lg rounded-pill px-5 py-3 shadow"
                style={{ backgroundColor: "#FFD700", color: "#5D5D5D" }}>
            Start Customizing
          </Link>
        </section>

        {/* Features Section */}
        <section className="py-5">
          <div className="row g-4">
            {[
              { title: "Premium Quality", icon: "🌟" },
              { title: "Fast Delivery", icon: "🚚" },
              { title: "Custom Design", icon: "✨" },
              { title: "Secure Payment", icon: "🔒" }
            ].map((feature, index) => (
              <div key={index} className="col-md-3">
                <div className="text-center p-4 rounded-4 h-100"
                     style={{ backgroundColor: "white", boxShadow: "0 0 15px rgba(0,0,0,0.1)" }}>
                  <div className="display-4 mb-3">{feature.icon}</div>
                  <h5 style={{ color: "#5D5D5D" }}>{feature.title}</h5>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Newsletter Section */}
      <section className="py-5" style={{ backgroundColor: "#FFB6C1" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <h3 className="text-white mb-4">Stay Updated</h3>
              <div className="input-group mb-3">
                <input type="email" className="form-control rounded-pill-start" 
                       placeholder="Enter your email" />
                <button className="btn rounded-pill-end px-4"
                        style={{ backgroundColor: "#FFD700", color: "#5D5D5D" }}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4" style={{ backgroundColor: "#5D5D5D" }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h5 className="text-white mb-3">Quick Links</h5>
              <ul className="list-unstyled">
                <li><Link to="/store" className="text-decoration-none text-light">Store</Link></li>
                <li><Link to="/customize" className="text-decoration-none text-light">Customize</Link></li>
                <li><Link to="/about" className="text-decoration-none text-light">About Us</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h5 className="text-white mb-3">Contact Us</h5>
              <p className="text-light mb-1">📧 info@teddyshaven.com</p>
              <p className="text-light mb-1">📞 +94 11 234 5678</p>
            </div>
            <div className="col-md-4">
              <h5 className="text-white mb-3">Follow Us</h5>
              <div className="d-flex gap-3">
                <a href="#" className="text-light fs-4">📱</a>
                <a href="#" className="text-light fs-4">💬</a>
                <a href="#" className="text-light fs-4">📸</a>
              </div>
            </div>
          </div>
          <hr className="mt-4 mb-3 border-light" />
          <p className="text-center text-light mb-0">
            &copy; 2023 Teddy's Haven. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;