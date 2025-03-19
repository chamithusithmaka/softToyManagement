import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg">
        <h3 className="text-lg font-bold">Download Order Report</h3>
        <p className="mt-2">Would you like to download the order report?</p>
        <div className="mt-4">
          <button
            onClick={onConfirm}
            className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
