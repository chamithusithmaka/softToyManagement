import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Notification = ({ message, onClose }) => {
  return (
    <div
      className="position-fixed top-0 start-50 translate-middle-x w-50 mt-3 z-3"
      style={{ zIndex: 1050 }}
    >
      <div className="alert alert-primary alert-dismissible fade show shadow-lg" role="alert">
        <strong>Notification:</strong> {message}
        <button type="button" className="btn-close" onClick={onClose}></button>
      </div>
    </div>
  );
};

export default Notification;
