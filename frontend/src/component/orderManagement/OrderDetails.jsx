import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function OrderDetails() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/api/orders/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError('Failed to load order details. Please try again.');
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const handleBack = () => {
        window.history.back();
    };

    const handleAccept = async () => {
        try {
            await axios.put(`http://localhost:5555/api/orders/${orderId}`, { status: 'Completed' });
            setOrder(prevOrder => ({ ...prevOrder, status: 'Completed' }));
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleCancel = async () => {
        try {
            await axios.put(`http://localhost:5555/api/orders/${orderId}`, { status: 'Cancelled' });
            setOrder(prevOrder => ({ ...prevOrder, status: 'Cancelled' }));
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const handleDelete = async () => {
        const response = await axios.delete(`http://localhost:5555/api/orders/${orderId}`);
        if (response.status === 200) {
            handleBack();
        }
    };

    const handleDownloadReport = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(0, 51, 102);
        doc.text('Order Report', 14, 22);

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Order ID: ${order._id}`, 14, 32);
        doc.text(`Customer Name: ${order.customerInfo.name}`, 14, 40);
        doc.text(`Customer Address: ${order.customerInfo.address}`, 14, 48);
        doc.text(`Customer Phone: ${order.customerInfo.phone}`, 14, 56);
        doc.text(`Status: ${order.status}`, 14, 64);

        const items = order.items.map(item => [
            item.name,
            item.quantity,
            `LKR ${item.price.toFixed(2)}`
        ]);

        doc.autoTable({
            startY: 70,
            head: [['Item Name', 'Quantity', 'Price']],
            body: items,
            headStyles: {
                fillColor: [0, 123, 255],
                textColor: [255, 255, 255],
            },
            styles: {
                fillColor: [240, 240, 240],
                textColor: [0, 0, 0],
            },
        });

        const totalPrice = order.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
        doc.text(`Total Price: LKR ${totalPrice}`, 14, doc.autoTable.previous.finalY + 10);

        doc.save('Order_Report.pdf');
    };

    if (error) {
        return <p className="text-danger fw-bold">{error}</p>;
    }

    if (!order) {
        return <p className="text-muted">Loading order details...</p>;
    }

    return (
        <div className="container my-5">
            <button className="btn btn-link text-primary mb-3" onClick={handleBack}>
                <i className="bi bi-arrow-left me-2"></i>Back
            </button>
            <h2 className="text-center text-primary mb-4">Order Details</h2>
            <div className="row g-4">
                {/* Customer Information */}
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title text-primary">Customer Information</h4>
                            <p><strong>Name:</strong> {order.customerInfo.name}</p>
                            <p><strong>Address:</strong> {order.customerInfo.address}</p>
                            <p><strong>Phone:</strong> {order.customerInfo.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Order Status */}
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title text-primary">Order Status</h4>
                            <p>
                                <strong>Status:</strong>{' '}
                                <span className={`fw-bold ${order.status === 'Completed' ? 'text-success' : order.status === 'Cancelled' ? 'text-danger' : 'text-warning'}`}>
                                    {order.status}
                                </span>
                            </p>
                            <p><strong>Total Price:</strong> LKR {order.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Items List */}
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h4 className="card-title text-primary">Items</h4>
                            <ul className="list-group">
                                {order.items.map(item => (
                                    <li key={item._id} className="list-group-item">
                                        {item.name} x {item.quantity} - LKR {item.price.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="col-12">
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-success" onClick={handleAccept}>Accept</button>
                        <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                        <button className="btn btn-secondary" onClick={handleDelete}>Delete</button>
                        <button className="btn btn-primary" onClick={handleDownloadReport}>
                            Download Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;