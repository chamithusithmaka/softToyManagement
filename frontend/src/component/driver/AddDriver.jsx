import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../delivery/managerHeader';

const AddDriver = () => {
    const [driver, setDriver] = useState({
        name: '',
        address: '',
        phone: '',
        nic: '',
        vehicleType: '',
        vehicleNo: '',
        licenseNo: ''
    });
    const [errors, setErrors] = useState({});
    const [existingDrivers, setExistingDrivers] = useState([]);

    useEffect(() => {
        const fetchExistingDrivers = async () => {
            try {
                const response = await axios.get('http://localhost:5555/api/drivers');
                setExistingDrivers(response.data);
            } catch (error) {
                console.error('Error fetching drivers', error);
            }
        };
        fetchExistingDrivers();
    }, []);

    const validateForm = () => {
        let tempErrors = {};
        const nicRegex = /^(\d{9}[Vv]|\d{12})$/;
        if (!nicRegex.test(driver.nic)) {
            tempErrors.nic = "NIC must be 12 digits or 9 digits ending with 'V' or 'v'";
        }
        
        if (existingDrivers.some(d => d.nic === driver.nic)) {
            tempErrors.nic = "NIC already exists";
        }
        if (existingDrivers.some(d => d.licenseNo === driver.licenseNo)) {
            tempErrors.licenseNo = "License number already exists";
        }
        if (existingDrivers.some(d => d.vehicleNo === driver.vehicleNo)) {
            tempErrors.vehicleNo = "Vehicle number already exists";
        }
        if (!/^[0-9]{10}$/.test(driver.phone)) {
            tempErrors.phone = "Phone number must be 10 digits";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDriver({ ...driver, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            await axios.post('http://localhost:5555/api/drivers', driver);
            alert('Driver added successfully');
            setDriver({ name: '', address: '', phone: '', nic: '', vehicleType: '', vehicleNo: '', licenseNo: '' });
        } catch (error) {
            console.error('Error adding driver', error);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
        <div className="container-fluid" style={{ marginLeft: "16rem" }}>
        <div className="container mt-5">
            <h2>Add New Driver</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={driver.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={driver.address}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        type="text"
                        className="form-control"
                        name="phone"
                        value={driver.phone}
                        onChange={handleChange}
                        required
                    />
                    {errors.phone && <small className="text-danger">{errors.phone}</small>}
                </div>
                <div className="mb-3">
                    <label className="form-label">NIC</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nic"
                        value={driver.nic}
                        onChange={handleChange}
                        required
                    />
                    {errors.nic && <small className="text-danger">{errors.nic}</small>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Vehicle Type</label>
                    <input
                        type="text"
                        className="form-control"
                        name="vehicleType"
                        value={driver.vehicleType}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Vehicle No</label>
                    <input
                        type="text"
                        className="form-control"
                        name="vehicleNo"
                        value={driver.vehicleNo}
                        onChange={handleChange}
                        required
                    />
                    {errors.vehicleNo && <small className="text-danger">{errors.vehicleNo}</small>}
                </div>
                <div className="mb-3">
                    <label className="form-label">License No</label>
                    <input
                        type="text"
                        className="form-control"
                        name="licenseNo"
                        value={driver.licenseNo}
                        onChange={handleChange}
                        required
                    />
                    {errors.licenseNo && <small className="text-danger">{errors.licenseNo}</small>}
                </div>
                <button type="submit" className="btn btn-primary">Add Driver</button>
            </form>
        </div>
        </div>
        </div>
    );
};

export default AddDriver;
