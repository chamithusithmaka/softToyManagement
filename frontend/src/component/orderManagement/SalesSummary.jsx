import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // For automatic table generation
import ManagerHeader from './managerHeader';

function SalesSummary() {
    const [orders, setOrders] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [completedOrders, setCompletedOrders] = useState(0);
    const [canceledOrders, setCanceledOrders] = useState(0);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:5555/api/orders');
                const orders = response.data;
                setOrders(orders);

                // Calculate total revenue
                const revenue = orders
                    .filter(order => order.status === 'Completed')
                    .reduce((total, order) => total + order.items.reduce((sum, item) => sum + item.price * item.quantity, 0), 0);
                setTotalRevenue(revenue.toFixed(2));

                // Count orders by status
                const pending = orders.filter(order => order.status === 'Pending').length;
                const completed = orders.filter(order => order.status === 'Completed').length;
                const canceled = orders.filter(order => order.status === 'Cancelled').length;

                setPendingOrders(pending);
                setCompletedOrders(completed);
                setCanceledOrders(canceled);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    // Function to download the sales summary as a PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Online Sales Summary', 14, 20);

        // Get current date and time
        const date = new Date();
        const formattedDate = date.toLocaleString();

        // Add report generation date
        doc.setFontSize(12);
        doc.text(`Generated on: ${formattedDate}`, 14, 30);

        // Add total revenue and other stats
        doc.setFontSize(16);
        doc.text(`Total Revenue: LKR ${totalRevenue}`, 14, 40);
        doc.text(`Pending Orders: ${pendingOrders}`, 14, 50);
        doc.text(`Completed Orders: ${completedOrders}`, 14, 60);
        doc.text(`Canceled Orders: ${canceledOrders}`, 14, 70);

        // Add Orders Breakdown table
        const tableData = orders.map(order => [
            order._id,
            order.customerInfo?.name || 'N/A', // Validate customerInfo and name
            order.status,
            order.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2),
        ]);

        autoTable(doc, {
            head: [['Order ID', 'Customer Name', 'Status', 'Total Price']],
            body: tableData,
            startY: 90,
        });

        doc.save('sales_summary.pdf');
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <ManagerHeader />

            {/* Main Content */}
            <div className="container-fluid" style={{ marginLeft: '16rem' }}>
                <h2 className="fw-bold mb-4">Online Sales Summary</h2>
                <div className="row mb-4">
                    {/* Total Revenue Card */}
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-muted">Total Revenue</h5>
                                <p className="card-text fs-4 text-success">LKR {totalRevenue}</p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Orders Card */}
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-muted">Pending Orders</h5>
                                <p className="card-text fs-4 text-warning">{pendingOrders}</p>
                            </div>
                        </div>
                    </div>

                    {/* Completed Orders Card */}
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-muted">Completed Orders</h5>
                                <p className="card-text fs-4 text-success">{completedOrders}</p>
                            </div>
                        </div>
                    </div>

                    {/* Canceled Orders Card */}
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-muted">Canceled Orders</h5>
                                <p className="card-text fs-4 text-danger">{canceledOrders}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Download Button */}
                <button
                    onClick={downloadPDF}
                    className="btn btn-primary mb-4"
                >
                    Download Sales Summary
                </button>

                {/* Orders Breakdown Table */}
                <h3 className="fw-bold mb-3">Orders Breakdown</h3>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-secondary">
                            <tr>
                                <th>Customer Name</th>
                                <th>Status</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order.customerInfo?.name || 'N/A'}</td> {/* Validate customerInfo */}
                                    <td>
                                        <span
                                            className={`badge ${
                                                order.status === 'Completed'
                                                    ? 'bg-success'
                                                    : order.status === 'Pending'
                                                    ? 'bg-warning text-dark'
                                                    : 'bg-danger'
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        LKR: {order.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SalesSummary;