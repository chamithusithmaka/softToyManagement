import React, { useState } from 'react';
import ManagerHeader from '../InventoryManagement/managerHeader';
import axios from 'axios';

const AddCategoryForm = () => {
  const [categoryCode, setCategoryCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5555/categories', {
        categoryCode,
        name,
        description,
      });
      alert('Category added successfully!');
      // Reset form
      setCategoryCode('');
      setName('');
      setDescription('');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category. Please try again.');
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <ManagerHeader />

      {/* Main Content */}
      <div className="container-fluid" style={{ marginLeft: '16rem' }}>
        <div className="row justify-content-center mt-4">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <form
              onSubmit={handleSubmit}
              className="p-4 bg-white shadow rounded"
            >
              <h2 className="text-center mb-4">Add New Category</h2>

              {statusMessage && (
                <div className="alert alert-danger text-center" role="alert">
                  {statusMessage}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="categoryCode" className="form-label">
                  Category Code
                </label>
                <input
                  type="text"
                  id="categoryCode"
                  value={categoryCode}
                  onChange={(e) => setCategoryCode(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
  <label htmlFor="name" className="form-label">
    Name
  </label>
  <input
    type="text"
    id="name"
    value={name}
    onChange={(e) => {
      const inputValue = e.target.value;
      // Allow only letters and spaces
      if (/^[a-zA-Z\s]*$/.test(inputValue)) {
        setName(inputValue);
      }
    }}
    className="form-control"
    required
  />
</div>


              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-danger"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryForm;