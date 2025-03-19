import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ManagerHeader from '../InventoryManagement/managerHeader';

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    categoryCode: '',
    name: '',
    description: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/categories/${id}`);
        setCategory(response.data);
      } catch (error) {
        setError('Failed to fetch category.');
        console.error('Error fetching category:', error);
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5555/categories/${id}`, category);
      navigate(`/categories/${id}`);
    } catch (error) {
      setError('Failed to update category.');
      console.error('Error updating category:', error);
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
            <h1 className="text-center mb-4">Update Category</h1>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <div className="card shadow-lg p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="categoryCode" className="form-label">
                    Category Code
                  </label>
                  <input
                    type="text"
                    id="categoryCode"
                    name="categoryCode"
                    value={category.categoryCode}
                    onChange={handleChange}
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
                    name="name"
                    value={category.name}
                    onChange={handleChange}
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
                    name="description"
                    value={category.description}
                    onChange={handleChange}
                    className="form-control"
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Update Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;