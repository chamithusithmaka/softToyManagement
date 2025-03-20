import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ManagerHeader from '../InventoryManagement/managerHeader';

const AddItemForm = () => {
  const [categories, setCategories] = useState([]);
  const [item, setItem] = useState({
    name: '',
    code: '',
    companyName: '',
    description: '',
    qty: 0,
    buyingPrice: 0,
    price: 0,
    category: '',
    photo: null,
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5555/categories');
        setCategories(response.data);
      } catch (error) {
        setError('Failed to fetch categories.');
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setItem((prev) => ({
        ...prev,
        photo: file,
      }));
      setErrors((prev) => ({ ...prev, photo: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!item.name.trim()) newErrors.name = 'Name is required';
    if (item.name.length < 3) newErrors.name = 'Name must be at least 3 characters long';
    if (!item.code.trim()) newErrors.code = 'Code is required';
    if (item.code.length < 3) newErrors.code = 'Code must be at least 3 characters long';
    if (!item.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!item.description.trim()) newErrors.description = 'Description is required';
    if (item.qty <= 0) newErrors.qty = 'Quantity must be greater than 0';
    if (item.buyingPrice <= 0) newErrors.buyingPrice = 'Buying Price must be greater than 0';
    if (item.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!item.category) newErrors.category = 'Please select a category';
    if (!item.photo) {
      newErrors.photo = 'Photo is required';
    } else if (item.photo.size > 1048576) {
      newErrors.photo = 'Photo size should not exceed 1MB';
    } else if (!/\.(jpg|jpeg|png)$/i.test(item.photo.name)) {
      newErrors.photo = 'Photo must be in JPG, JPEG, or PNG format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        formData.append(key, item[key]);
      }
    }

    try {
      await axios.post('http://localhost:5555/inventory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Item added successfully!');
      navigate('/dashboard/inventory');
    } catch (error) {
      setError('Failed to add item.');
      console.error('Error adding item:', error);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <ManagerHeader />

      {/* Main Content */}
      <div className="container-fluid" style={{ marginLeft: '16rem' }}>
        <div className="row justify-content-center mt-4">
          <div className="col-lg-8 col-md-10 col-sm-12">
            <h1 className="text-center mb-4">Add New Item</h1>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={item.name}
                  onChange={handleChange}
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  required
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="code" className="form-label">
                  Code
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={item.code}
                  onChange={handleChange}
                  className={`form-control ${errors.code ? 'is-invalid' : ''}`}
                  required
                />
                {errors.code && <div className="invalid-feedback">{errors.code}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="companyName" className="form-label">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={item.companyName}
                  onChange={handleChange}
                  className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                  required
                />
                {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={item.description}
                  onChange={handleChange}
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  rows="4"
                  required
                ></textarea>
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="qty" className="form-label">
                  Quantity
                </label>
                <input
                  type="number"
                  id="qty"
                  name="qty"
                  value={item.qty}
                  onChange={handleChange}
                  className={`form-control ${errors.qty ? 'is-invalid' : ''}`}
                  required
                />
                {errors.qty && <div className="invalid-feedback">{errors.qty}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="buyingPrice" className="form-label">
                  Buying Price
                </label>
                <input
                  type="number"
                  id="buyingPrice"
                  name="buyingPrice"
                  value={item.buyingPrice}
                  onChange={handleChange}
                  className={`form-control ${errors.buyingPrice ? 'is-invalid' : ''}`}
                  required
                />
                {errors.buyingPrice && <div className="invalid-feedback">{errors.buyingPrice}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={item.price}
                  onChange={handleChange}
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  required
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={item.category}
                  onChange={handleChange}
                  className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="photo" className="form-label">
                  Photo
                </label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`form-control ${errors.photo ? 'is-invalid' : ''}`}
                  required
                />
                {errors.photo && <div className="invalid-feedback">{errors.photo}</div>}
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary">
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItemForm;