import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ManagerHeader from './managerHeader';

const AdminDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDriver, setSelectedDriver] = useState({});
    const [selectedStatus, setSelectedStatus] = useState({});

    useEffect(() => {
        fetchDeliveries();
        fetchDrivers();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const response = await axios.get('http://localhost:5555/api/delivery');
            setDeliveries(response.data);
        } catch (error) {
            console.error('Error fetching deliveries', error);
        }
    };

    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:5555/api/drivers');
            setDrivers(response.data);
        } catch (error) {
            console.error('Error fetching drivers', error);
        }
    };

    const assignDriver = async (deliveryId) => {
        try {
            await axios.patch(`http://localhost:5555/api/delivery/${deliveryId}/assign`, { driverId: selectedDriver[deliveryId] });
            fetchDeliveries();
        } catch (error) {
            console.error('Error assigning driver', error);
        }
    };

    const updateStatus = async (deliveryId) => {
        try {
            await axios.patch(`http://localhost:5555/api/delivery/${deliveryId}/status`, { status: selectedStatus[deliveryId] });
            fetchDeliveries();
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    const deleteDelivery = async (deliveryId) => {
        if (window.confirm('Are you sure you want to delete this delivery?')) {
            try {
                await axios.delete(`http://localhost:5555/api/delivery/${deliveryId}`);
                fetchDeliveries();
            } catch (error) {
                console.error('Error deleting delivery', error);
            }
        }
    };

    const filteredDeliveries = deliveries.filter(delivery =>
        delivery.orderId.includes(searchTerm) ||
        delivery.userId.includes(searchTerm) ||
        delivery.deliveryAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text('Delivery Report', 20, 10);

        const date = new Date();
        const formattedDate = date.toLocaleString();
        doc.setFontSize(10);
        doc.text(`Generated on: ${formattedDate}`, 20, 16);

        const statuses = ['Pending', 'Assigned', 'Out for Delivery', 'Delivered', 'Cancelled'];
        statuses.forEach((status, index) => {
            const filtered = deliveries.filter(delivery => delivery.status === status);
            doc.text(`${status} Deliveries`, 20, 26 + index * 50);
            doc.autoTable({
                startY: 31 + index * 50,
                head: [['Order ID', 'User ID', 'Address', 'Phone', 'Status', 'Driver']],
                body: filtered.map(delivery => [
                    delivery.orderId, delivery.userId, delivery.deliveryAddress,
                    delivery.phone, delivery.status, delivery.assignedDriver?.name || 'Unassigned'
                ])
            });
        });
        doc.save('Delivery_Report.pdf');
    };

    return (
        <div className="d-flex">
        {/* Sidebar */}
        <ManagerHeader />
        <div className="container-fluid" style={{ marginLeft: '10rem' }}>
        <div className="row justify-content-center mt-4">
          <div className="col-lg-10">
            <h1 className="text-2xl font-bold mb-4 text-center">Admin Deliveries</h1>
            <div className="flex justify-between items-center mb-4">
                <input 
                    type="text" 
                    placeholder="Search by Order ID, User ID, Address, or Status" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="form-control w-50"
                />
                <button 
                    onClick={generatePDF} 
                    className="flex btn btn-info p-2 mt-3"
                >
                    Download Report
                </button>
            </div>
            <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-secondary">
                        <tr>
                            <th className="p-2 border" scope='col'>Order ID</th>
                            <th className="p-2 border" scope='col'>User ID</th>
                            <th className="p-2 border" scope='col'>Delivery Address</th>
                            <th className="p-2 border" scope='col'>Phone</th>
                            <th className="p-2 border" scope='col'>Status</th>
                            <th className="p-2 border" scope='col'>Assigned Driver</th>
                            <th className="p-2 border" scope='col'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDeliveries.map(delivery => (
                            <tr key={delivery._id} className="hover:bg-gray-100">
                                <td className="p-2 border text-center">{delivery.orderId}</td>
                                <td className="p-2 border text-center">{delivery.userId}</td>
                                <td className="p-2 border text-center">{delivery.deliveryAddress}</td>
                                <td className="p-2 border text-center">{delivery.phone}</td>
                                <td className="p-2 border text-center font-semibold">{delivery.status}</td>
                                <td className="p-2 border text-center">
                                    {delivery.assignedDriver ? delivery.assignedDriver.name : 'Unassigned'}
                                </td>
                                <td className="p-2 border text-center">
                                    <select 
                                        onChange={(e) => setSelectedDriver({ ...selectedDriver, [delivery._id]: e.target.value })} 
                                        className="border p-1 rounded"
                                    >
                                        <option value="">Select Driver</option>
                                        {drivers.map(driver => (
                                            <option key={driver._id} value={driver._id}>{driver.name}</option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={() => assignDriver(delivery._id)} 
                                        className="btn btn-success btn-rounded m-2 hover:bg-green-500"
                                    >
                                        Assign
                                    </button>
                                    <select 
                                        onChange={(e) => setSelectedStatus({ ...selectedStatus, [delivery._id]: e.target.value })} 
                                        className="border p-1 rounded ml-2"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Assigned">Assigned</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <button 
                                        onClick={() => updateStatus(delivery._id)} 
                                        className="btn btn-warning btn-rounded m-2 hover:bg-yellow-800">
                                        Update
                                    </button>
                                    <button 
                                        onClick={() => deleteDelivery(delivery._id)} 
                                        className="btn btn-danger btn-rounded m-2 hover:bg-red-500">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
        </div>
        </div>
    );
};

export default AdminDeliveries;
