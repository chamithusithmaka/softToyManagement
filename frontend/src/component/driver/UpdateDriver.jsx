import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdateDriver = ({ match }) => {
    const [driver, setDriver] = useState({
        name: '',
        address: '',
        phone: '',
        nic: '',
        vehicleType: '',
        vehicleNo: '',
        licenseNo: ''
    });

    useEffect(() => {
        fetchDriver();
    }, []);

    const fetchDriver = async () => {
        try {
            const response = await axios.get(`http://localhost:5555/api/drivers/${match.params.id}`);
            setDriver(response.data);
        } catch (error) {
            console.error('Error fetching driver', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDriver({ ...driver, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`/api/drivers/${match.params.id}`, driver);
            alert('Driver updated successfully');
        } catch (error) {
            console.error('Error updating driver', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Update Driver</h2>
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
                </div>
                <button type="submit" className="btn btn-success">Update Driver</button>
            </form>
        </div>
    );
};

export default UpdateDriver;