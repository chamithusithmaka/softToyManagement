import React from "react";
import Header from "./HomeHeader";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  return (
    <div>
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <main className="container my-5">
        <section className="text-center">
          <h2>Welcome to My Store</h2>
          <p className="lead">
            Your one-stop shop for high-quality soft toys. Explore our store, customize your orders, and bring joy to your loved ones!
          </p>
        </section>

        {/* Store Section */}
        <section className="mt-5">
          <h3>Our Store</h3>
          <p>
            Browse through our wide range of soft toys, from cuddly teddy bears to adorable plush animals. We have something for everyone!
          </p>
          <div className="row">
            <div className="col-md-4">
              <div className="card">
                <img
                  src="https://via.placeholder.com/150"
                  className="card-img-top"
                  alt="Teddy Bear"
                />
                <div className="card-body">
                  <h5 className="card-title">Teddy Bear</h5>
                  <p className="card-text">Soft and cuddly teddy bear for all ages.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img
                  src="https://via.placeholder.com/150"
                  className="card-img-top"
                  alt="Plush Bunny"
                />
                <div className="card-body">
                  <h5 className="card-title">Plush Bunny</h5>
                  <p className="card-text">Adorable bunny perfect for gifting.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <img
                  src="https://via.placeholder.com/150"
                  className="card-img-top"
                  alt="Stuffed Elephant"
                />
                <div className="card-body">
                  <h5 className="card-title">Stuffed Elephant</h5>
                  <p className="card-text">A cute elephant to brighten your day.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customize Orders Section */}
        <section className="mt-5">
          <h3>Customize Your Order</h3>
          <p>
            Want something unique? Customize your soft toy with personalized messages, colors, and designs. Make it truly special!
          </p>
          <button className="btn btn-primary">Start Customizing</button>
        </section>

        {/* About Us Section */}
        <section className="mt-5">
          <h3>About Us</h3>
          <p>
            At My Store, we are passionate about creating smiles with our soft toys. Our mission is to provide high-quality, safe, and lovable toys for everyone.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-3">
        <p>&copy; 2023 My Store. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;