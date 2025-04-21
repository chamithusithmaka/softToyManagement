import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "./adminSideBar";
import { Modal, Button, Form } from "react-bootstrap";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import Swal from 'sweetalert2';

const AllCustomOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    
    // New state for email modal
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailData, setEmailData] = useState({
        to: "",
        subject: "Pending Orders Report",
        text: "Please find attached the list of pending orders that require production."
    });
    const [isLoading, setIsLoading] = useState(false);

    // Fetch all customized orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5555/api/costomorders");
                const fetchedOrders = response.data;

                // Fetch delivery status for each order
                const ordersWithStatus = await Promise.all(
                    fetchedOrders.map(async (order) => {
                        try {
                            const statusResponse = await axios.get(
                                `http://localhost:5555/api/delivery/status/${order.orderId}`
                            );
                            return { ...order, deliveryStatus: statusResponse.data.status };
                        } catch (error) {
                            console.error(`Error fetching delivery status for order ${order.orderId}:`, error);
                            return { ...order, deliveryStatus: "N/A" };
                        }
                    })
                );

                // Filter out orders with delivery status "N/A"
                const validOrders = ordersWithStatus.filter(order => order.deliveryStatus !== "N/A");

                setOrders(validOrders);
                setFilteredOrders(validOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setErrorMessage("Failed to fetch orders. Please try again later.");
            }
        };

        fetchOrders();
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = orders.filter((order) =>
            order.orderId.toLowerCase().includes(query)
        );
        setFilteredOrders(filtered);
    };

    // Handle view button click
    const handleViewOrder = (orderId) => {
        navigate(`/admin-order-details/${orderId}`);
    };

    // Handle email input changes
    const handleEmailInputChange = (e) => {
        const { name, value } = e.target;
        setEmailData({
            ...emailData,
            [name]: value
        });
    };

    // Function to generate PDF of pending orders
    const generateOrdersPDF = () => {
        const pendingOrders = filteredOrders.filter(order => 
            order.status === "Pending" || order.deliveryStatus === "Pending"
        );
        
        if (pendingOrders.length === 0) {
            return null;
        }

        // Create new PDF document
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text("Pending Orders Report", 14, 22);
        
        // Add date
        doc.setFontSize(11);
        doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);
        
        // Create table with order data
        const tableColumn = ["Order ID", "Customer", "Toy Type", "Fabric", "Size", "Quantity", "Price (LKR)"];
        const tableRows = pendingOrders.map(order => [
            order.orderId,
            order.customerInfo?.name || "N/A",
            order.toyType,
            order.fabric,
            order.size,
            order.quantity,
            order.totalPrice?.toLocaleString() || "N/A"
        ]);
        
        // Generate the table
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [41, 128, 185] }
        });
        
        // Add summary information
        const finalY = doc.lastAutoTable.finalY || 40;
        doc.setFontSize(12);
        doc.text(`Total Pending Orders: ${pendingOrders.length}`, 14, finalY + 15);
        
        const totalValue = pendingOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
        doc.text(`Total Order Value: LKR ${totalValue.toLocaleString()}`, 14, finalY + 25);
        
        // Return PDF as blob
        return doc.output('blob');
    };

    // Send pending orders via email
    const handleSendOrdersEmail = async () => {
        // Validate email
        if (!emailData.to || !emailData.to.includes('@')) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Email',
                text: 'Please enter a valid email address.'
            });
            return;
        }

        // Generate PDF
        const pdfBlob = generateOrdersPDF();
        
        if (!pdfBlob) {
            Swal.fire({
                icon: 'warning',
                title: 'No Pending Orders',
                text: 'There are no pending orders to send.'
            });
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Create form data
            const formData = new FormData();
            formData.append('to', emailData.to);
            formData.append('subject', emailData.subject);
            formData.append('text', emailData.text);
            formData.append('file', pdfBlob, 'pending_orders.pdf');
            
            // Send email with PDF attachment
            const response = await axios.post('http://localhost:5555/api/send-email', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setShowEmailModal(false);
            
            Swal.fire({
                icon: 'success',
                title: 'Email Sent!',
                text: 'Pending orders have been sent to the production team.',
                confirmButtonColor: '#0d6efd'
            });
        } catch (error) {
            console.error('Error sending email:', error);
            Swal.fire({
                icon: 'error',
                title: 'Email Failed',
                text: 'Failed to send the orders email. Please try again.',
                confirmButtonColor: '#dc3545'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Count pending orders
    const pendingOrdersCount = filteredOrders.filter(
        order => order.status === "Pending" || order.deliveryStatus === "Pending"
    ).length;

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <AdminSideBar />

            {/* Main Content */}
            <div className="container-fluid" style={{ marginLeft: "16rem" }}>
                <h2 className="text-center mb-4">All Customized Orders</h2>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                {/* Action Buttons Row */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by Order ID"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className="col-md-6 text-end">
                        <button 
                            className="btn btn-primary" 
                            onClick={() => setShowEmailModal(true)}
                        >
                            Send Orders to Production ({pendingOrdersCount})
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Name</th>
                                <th>Toy Type</th>
                                <th>Quantity</th>
                                <th>Total Price (LKR)</th>
                                {/* <th>Status</th> */}
                                <th>Delivery Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order.orderId}</td>
                                        <td>{order.customerInfo.name}</td>
                                        <td>{order.toyType}</td>
                                        <td>{order.quantity}</td>
                                        <td>{order.totalPrice?.toLocaleString()}</td>
                                        {/* <td>
                                            <span className={`badge ${order.status === 'Pending' ? 'bg-warning' : 'bg-success'}`}>
                                                {order.status}
                                            </span>
                                        </td> */}
                                        <td>
                                            <span className={`badge ${order.deliveryStatus === 'Pending' ? 'bg-warning' : 'bg-success'}`}>
                                                {order.deliveryStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleViewOrder(order._id)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Email Modal */}
            <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Send Pending Orders to Production</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Recipient Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="to"
                                value={emailData.to}
                                onChange={handleEmailInputChange}
                                placeholder="production@example.com"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Subject</Form.Label>
                            <Form.Control
                                type="text"
                                name="subject"
                                value={emailData.subject}
                                onChange={handleEmailInputChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="text"
                                value={emailData.text}
                                onChange={handleEmailInputChange}
                                rows={3}
                                required
                            />
                        </Form.Group>
                    </Form>
                    <div className="alert alert-info">
                        <small>
                            A PDF with {pendingOrdersCount} pending orders will be attached to this email.
                        </small>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSendOrdersEmail}
                        disabled={isLoading}
                    >
                        {isLoading ? "Sending..." : "Send Email"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AllCustomOrders;