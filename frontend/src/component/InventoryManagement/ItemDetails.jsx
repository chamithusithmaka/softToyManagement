import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ItemDetails = () => {
  const { id } = useParams(); // Get item ID from URL
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal state
  const [updatedItem, setUpdatedItem] = useState({}); // For handling updates
  const [categories, setCategories] = useState([]); // To store available categories
  const [formErrors, setFormErrors] = useState({}); // For storing validation errors
  const [photo, setPhoto] = useState(null); // For storing the new photo file

  // Fetch item details and available categories
  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        // Fetch item details by ID
        const itemResponse = await axios.get(`http://localhost:5555/inventory-items/${id}`);
        if (!itemResponse.data) {
          throw new Error("Item not found");
        }
        setItem(itemResponse.data);
        setUpdatedItem(itemResponse.data); // Initialize with fetched data

        // Fetch available categories
        const categoriesResponse = await axios.get("http://localhost:5555/categories");
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching item or category details:", error);
        setError("Error fetching item or category details. Please try again later.");
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5555/inventory-items/${id}`);
      alert("Item deleted successfully");
      navigate("/dashboard/inventory"); // Redirect back to the inventory list
    } catch (error) {
      alert("Error deleting item");
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!updatedItem.name) errors.name = "Name is required";
    if (!updatedItem.price || updatedItem.price < 0) errors.price = "Price must be a non-negative number";
    if (!updatedItem.qty || updatedItem.qty < 0) errors.qty = "Quantity must be a non-negative number";
    if (!updatedItem.description) errors.description = "Description is required";
    if (!updatedItem.companyName) errors.companyName = "Company name is required";
    if (!updatedItem.category) errors.category = "Category is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleUpdate = async () => {
    if (!validateForm()) return; // Only proceed if the form is valid

    try {
      const formData = new FormData();
      formData.append("name", updatedItem.name);
      formData.append("code", updatedItem.code);
      formData.append("companyName", updatedItem.companyName);
      formData.append("description", updatedItem.description);
      formData.append("qty", updatedItem.qty);
      formData.append("buyingPrice", updatedItem.buyingPrice);
      formData.append("price", updatedItem.price);
      formData.append("category", updatedItem.category?._id || "");

      // Append the photo file if a new one is selected
      if (photo) {
        formData.append("photo", photo);
      }

      const response = await axios.put(`http://localhost:5555/inventory-items/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Item updated successfully");
      setShowModal(false); // Close the modal after successful update
      setItem(response.data); // Update the item details with the response
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedItem({ ...updatedItem, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" }); // Clear error for this field
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find((cat) => cat._id === e.target.value);
    setUpdatedItem({ ...updatedItem, category: selectedCategory });
    setFormErrors({ ...formErrors, category: "" }); // Clear category error
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]); // Store the selected photo file
  };

  if (error) return <div className="text-danger text-center mt-4">{error}</div>;
  if (!item) return <div className="text-center mt-4">Loading...</div>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4 text-primary">Item Details</h1>
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            {item.photo && (
              <img
                src={`data:image/jpeg;base64,${item.photo}`}
                className="card-img-top rounded"
                alt={item.name}
                style={{ height: "400px", objectFit: "contain" }}
              />
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title text-dark fw-bold">{item.name}</h5>
              <p className="card-text">
                <strong>Price:</strong> LKR {item.price.toFixed(2)}
              </p>
              <p className="card-text">
                <strong>Quantity:</strong> {item.qty}
              </p>
              <p className="card-text">
                <strong>Description:</strong> {item.description}
              </p>
              <p className="card-text">
                <strong>Company:</strong> {item.companyName}
              </p>
              <p className="card-text">
                <strong>Category:</strong> {item.category?.name || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-center gap-3 mt-4">
        <button className="btn btn-secondary px-4" onClick={() => navigate(-1)}>
          Back
        </button>
        <button className="btn btn-warning px-4" onClick={() => setShowModal(true)}>
          Update
        </button>
        <button className="btn btn-danger px-4" onClick={handleDelete}>
          Delete
        </button>
      </div>

      {/* Modal for updating the item */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-primary">Update Item</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={updatedItem.name || ""}
                      onChange={handleInputChange}
                      className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                    />
                    {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={updatedItem.price || ""}
                      onChange={handleInputChange}
                      className={`form-control ${formErrors.price ? "is-invalid" : ""}`}
                    />
                    {formErrors.price && <div className="invalid-feedback">{formErrors.price}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      name="qty"
                      value={updatedItem.qty || ""}
                      onChange={handleInputChange}
                      className={`form-control ${formErrors.qty ? "is-invalid" : ""}`}
                    />
                    {formErrors.qty && <div className="invalid-feedback">{formErrors.qty}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={updatedItem.description || ""}
                      onChange={handleInputChange}
                      className={`form-control ${formErrors.description ? "is-invalid" : ""}`}
                      rows="3"
                    ></textarea>
                    {formErrors.description && <div className="invalid-feedback">{formErrors.description}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      name="companyName"
                      value={updatedItem.companyName || ""}
                      onChange={handleInputChange}
                      className={`form-control ${formErrors.companyName ? "is-invalid" : ""}`}
                    />
                    {formErrors.companyName && <div className="invalid-feedback">{formErrors.companyName}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      value={updatedItem.category?._id || ""}
                      onChange={handleCategoryChange}
                      className={`form-select ${formErrors.category ? "is-invalid" : ""}`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.category && <div className="invalid-feedback">{formErrors.category}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Photo</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handlePhotoChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary px-4" onClick={handleUpdate}>
                  Update
                </button>
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;