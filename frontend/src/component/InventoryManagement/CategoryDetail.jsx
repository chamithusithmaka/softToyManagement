import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ManagerHeader from '../InventoryManagement/managerHeader';

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
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

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5555/categories/${id}`);
      navigate('/catagory');
    } catch (error) {
      setError('Failed to delete category.');
      console.error('Error deleting category:', error);
    }
  };

  const handleUpdate = () => {
    navigate(`/categories/${id}/edit`);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <ManagerHeader />

      {/* Main Content */}
      <div className="container-fluid" style={{ marginLeft: '16rem' }}>
        <div className="row justify-content-center mt-4">
          <div className="col-lg-8 col-md-10 col-sm-12">
            <h1 className="text-center mb-4">Category Details</h1>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            {category && (
              <div className="card shadow-lg">
                <div className="card-body">
                  <div className="mb-3">
                    <h5 className="card-title">Category Code:</h5>
                    <p className="card-text">{category.categoryCode}</p>
                  </div>
                  <div className="mb-3">
                    <h5 className="card-title">Name:</h5>
                    <p className="card-text">{category.name}</p>
                  </div>
                  <div className="mb-3">
                    <h5 className="card-title">Description:</h5>
                    <p className="card-text">{category.description}</p>
                  </div>
                  <div className="mb-3">
                    <h5 className="card-title">Created At:</h5>
                    <p className="card-text">{new Date(category.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="mb-3">
                    <h5 className="card-title">Updated At:</h5>
                    <p className="card-text">{new Date(category.updatedAt).toLocaleString()}</p>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <Link to="/dashboard/catagory">
                      <button className="btn btn-secondary">Back</button>
                    </Link>
                    <button
                      onClick={handleUpdate}
                      className="btn btn-warning"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleDelete}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
