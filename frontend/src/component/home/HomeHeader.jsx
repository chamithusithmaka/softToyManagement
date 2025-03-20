import { Link } from "react-router-dom";
import { FaUser, FaStore, FaHome, FaTools } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  return (
    <header className="bg-primary text-white py-3 shadow">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo */}
        <h1 className="h4">Soft Toy Production</h1>
        
        {/* Navigation Links */}
        <nav>
          <ul className="nav">
            <li className="nav-item">
              <Link to="/home" className="nav-link text-white d-flex align-items-center">
                <FaHome className="me-2" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/store" className="nav-link text-white d-flex align-items-center">
                <FaStore className="me-2" /> Store
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/customize-order" className="nav-link text-white d-flex align-items-center">
                <FaTools className="me-2" /> Customize Order
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/my-customize-order" className="nav-link text-white d-flex align-items-center">
                <FaTools className="me-2" /> My costomise Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/profile" className="nav-link text-white d-flex align-items-center">
                <FaUser className="me-2" /> Profile
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;