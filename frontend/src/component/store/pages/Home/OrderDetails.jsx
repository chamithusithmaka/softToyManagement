import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrderReport from '../../components/OrderReport';

function OrderDetails() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const [result, setResult] = useState("");

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

     // Email sending function
     const handleEmailSend = async (event) => {
        event.preventDefault();
        setResult("Sending....");
        
        const formData = {
            recipientEmail: event.target.recipientEmail.value,
            subject: event.target.subject.value,
            message: event.target.message.value,
        };

        try {
            const response = await axios.post('http://localhost:5555/send-email', formData);
            if (response.data.success) {
                setResult("Email sent successfully!");
                event.target.reset();
            } else {
                setResult(response.data.message);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setResult('Failed to send email. Please try again.');
        }
    };

    const handleClear = () => {
        setResult("");
        document.getElementById("order-form").reset();
    };

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
    
        // Set title
        doc.setFontSize(20);
        doc.setTextColor(0, 51, 102); // Dark Blue Color
        doc.text('Order Report', 14, 22);
    
        // Set order details
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0); // Black Color
        doc.text(`Order ID: ${order._id}`, 14, 32);
        doc.text(`Customer Name: ${order.customerInfo.name}`, 14, 40);
        doc.text(`Customer Address: ${order.customerInfo.address}`, 14, 48);
        doc.text(`Customer Phone: ${order.customerInfo.phone}`, 14, 56);
        doc.text(`Email: ${order.customerInfo.email}`, 14, 64);
        doc.text(`Status: ${order.status}`, 14, 72);
    
        // Prepare items data
        const items = order.items.map(item => [
            item.name,
            item.quantity,
            `LKR ${item.price.toFixed(2)}`
        ]);
    
        // Add table for items
        doc.autoTable({
            startY: 80,
            head: [['Item Name', 'Quantity', 'Price']],
            body: items,
            headStyles: {
                fillColor: [0, 123, 255], // Bootstrap Primary Color
                textColor: [255, 255, 255], // White Color
            },
            styles: {
                fillColor: [240, 240, 240], // Light Gray for table rows
                textColor: [0, 0, 0], // Black for text
            },
        });
    
        // Calculate total price and add to PDF
        const totalPrice = order.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
        doc.text(`Total Price: LKR ${totalPrice}`, 14, doc.autoTable.previous.finalY + 10);
    
        // Save the PDF
        doc.save('Order_Report.pdf');
    };
    

    if (error) {
        return <p className="text-red-600 font-bold text-lg">{error}</p>;
    }

    if (!order) {
        return <p className="text-gray-500">Loading order details...</p>;
    }

    return (
        <div className="container mt-5 p-4 bg-white rounded shadow">
    <button
        className="btn btn-link text-primary mb-4"
        onClick={handleBack}
    >
        <i className="bi bi-arrow-left me-2"></i>
        Back
    </button>
    <h2 className="text-center text-primary mb-4">Order Details</h2>
    <div className="row justify-content-center">
        <div className="col-md-6 bg-light p-4 rounded shadow">
            <h4 className="text-primary mb-3">Order Information</h4>
            <p><strong>Customer Name:</strong> {order.customerInfo.name}</p>
            <p><strong>Customer Address:</strong> {order.customerInfo.address}</p>
            <p><strong>Customer Phone:</strong> {order.customerInfo.phone}</p>
            <p><strong>Email:</strong> {order.customerInfo.email}</p>
            <p>
                <strong>Status:</strong> 
                <span className={`fw-bold ${order.status === 'Completed' ? 'text-success' : order.status === 'Cancelled' ? 'text-danger' : 'text-warning'}`}>
                    {order.status}
                </span>
            </p>
            <h5 className="text-primary mt-3">Items:</h5>
            <ul className="list-unstyled">
                {order.items.map(item => (
                    <li key={item._id} className="text-primary">
                        {item.name} x {item.quantity} - LKR {item.price.toFixed(2)}
                    </li>
                ))}
            </ul>
            <p className="mt-3"><strong>Total Price:</strong> LKR {order.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
            <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-success" onClick={handleAccept}>Accept</button>
                <button className="btn btn-danger" onClick={handleCancel}>Cancel</button>
                <button className="btn btn-secondary" onClick={handleDelete}>Delete</button>
                <PDFDownloadLink
                    document={<OrderReport order={order} />}
                    fileName={`Order_Report_${order._id}.pdf`}
                    className="btn btn-primary"
                >
                    {({ loading }) => (loading ? 'Preparing Report...' : 'Download Report')}
                </PDFDownloadLink>
            </div>
        </div>
        <div className="col-md-6 bg-light p-4 rounded shadow">
            <h4 className="text-primary mb-3">Send Message To {order.customerInfo.name}</h4>
            <form id="order-form" onSubmit={handleEmailSend}>
                <div className="mb-3">
                    <label htmlFor="recipientEmail" className="form-label">Recipient Email</label>
                    <input type="email" id="recipientEmail" name="recipientEmail" className="form-control" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <input type="text" id="subject" name="subject" className="form-control" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea id="message" name="message" rows="4" className="form-control" required></textarea>
                </div>
                <div className="d-flex justify-content-between">
                    <button type="button" className="btn btn-danger" onClick={handleClear}>Clear</button>
                    <button type="submit" className="btn btn-primary">Send Email</button>
                </div>
                <p className={`mt-2 ${result.includes("successfully") ? "text-success" : "text-danger"}`}>{result}</p>
            </form>
        </div>
    </div>
</div>


    );
}

export default OrderDetails;
