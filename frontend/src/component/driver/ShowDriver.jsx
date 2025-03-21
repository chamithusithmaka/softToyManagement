import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../delivery/managerHeader';

const ShowDrivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:5555/api/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error('Error fetching drivers', error);
        }
    };

    const deleteDriver = async (id) => {
        if (window.confirm("Are you sure you want to delete this driver?")) {
            try {
                await axios.delete(`http://localhost:5555/api/drivers/${id}`);
                fetchDrivers();
            } catch (error) {
                console.error("Error deleting driver", error);
            }
        }
    };

    const handleEditClick = (driver) => {
        setSelectedDriver(driver);
    };

    const filteredDrivers = drivers.filter(driver =>
        driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.nic.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.licenseNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="container-fluid" style={{ marginLeft: "16rem" }}>
                <div className="container mt-5">
                    <h2>All Drivers</h2>
                    <input
                        type="text"
                        placeholder="Search by Name, Vehicle Type, NIC, Address, Vehicle No, License No"
                        className="form-control mb-3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-secondary">
                                <tr>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>NIC</th>
                                    <th>Vehicle Type</th>
                                    <th>Vehicle No</th>
                                    <th>License No</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDrivers.map(driver => (
                                    <tr key={driver._id}>
                                        <td>{driver.name}</td>
                                        <td>{driver.address}</td>
                                        <td>{driver.phone}</td>
                                        <td>{driver.nic}</td>
                                        <td>{driver.vehicleType}</td>
                                        <td>{driver.vehicleNo}</td>
                                        <td>{driver.licenseNo}</td>
                                        <td>
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(driver)}>Update</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteDriver(driver._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {selectedDriver && (
                        <div className="mt-4">
                            <h2>Update Driver</h2>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    await axios.patch(`http://localhost:5555/api/drivers/${selectedDriver._id}`, selectedDriver);
                                    alert("Driver updated successfully");
                                    fetchDrivers();
                                    setSelectedDriver(null);
                                } catch (error) {
                                    console.error("Error updating driver", error);
                                }
                            }}>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control" name="name" value={selectedDriver.name} onChange={(e) => setSelectedDriver({ ...selectedDriver, name: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Address</label>
                                    <input type="text" className="form-control" name="address" value={selectedDriver.address} onChange={(e) => setSelectedDriver({ ...selectedDriver, address: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Phone</label>
                                    <input type="text" className="form-control" name="phone" value={selectedDriver.phone} onChange={(e) => setSelectedDriver({ ...selectedDriver, phone: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">NIC</label>
                                    <input type="text" className="form-control" name="nic" value={selectedDriver.nic} onChange={(e) => setSelectedDriver({ ...selectedDriver, nic: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Vehicle Type</label>
                                    <input type="text" className="form-control" name="vehicleType" value={selectedDriver.vehicleType} onChange={(e) => setSelectedDriver({ ...selectedDriver, vehicleType: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Vehicle No</label>
                                    <input type="text" className="form-control" name="vehicleNo" value={selectedDriver.vehicleNo} onChange={(e) => setSelectedDriver({ ...selectedDriver, vehicleNo: e.target.value })} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">License No</label>
                                    <input type="text" className="form-control" name="licenseNo" value={selectedDriver.licenseNo} onChange={(e) => setSelectedDriver({ ...selectedDriver, licenseNo: e.target.value })} required />
                                </div>
                                <button type="submit" className="btn btn-success">Update Driver</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowDrivers;