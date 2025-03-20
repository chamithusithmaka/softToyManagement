import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // For automatic table generation
import AdminSideBar from "../constomizeOrder/adminSideBar";

function CustomOrderReport() {
    const [orders, setOrders] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [onDeliveryOrders, setOnDeliveryOrders] = useState(0);
    const [completedOrders, setCompletedOrders] = useState(0);
    const [cancelledOrders, setCancelledOrders] = useState(0);

    useEffect(() => {
        const fetchCustomOrders = async () => {
            try {
                const response = await axios.get("http://localhost:5555/api/costomorders");
                const orders = response.data;
                setOrders(orders);

                // Calculate total revenue
                const revenue = orders
                    .filter((order) => order.status === "Completed")
                    .reduce((total, order) => total + order.totalPrice, 0);
                setTotalRevenue(revenue.toFixed(2));

                // Count orders by status
                const pending = orders.filter((order) => order.status === "Pending").length;
                const onDelivery = orders.filter((order) => order.status === "On Delivery").length;
                const completed = orders.filter((order) => order.status === "Completed").length;
                const cancelled = orders.filter((order) => order.status === "Cancelled").length;

                setPendingOrders(pending);
                setOnDeliveryOrders(onDelivery);
                setCompletedOrders(completed);
                setCancelledOrders(cancelled);
            } catch (error) {
                console.error("Error fetching custom orders:", error);
            }
        };

        fetchCustomOrders();
    }, []);

    // Function to download the custom order report as a PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Customized Orders Report", 14, 20);

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
        doc.text(`On Delivery Orders: ${onDeliveryOrders}`, 14, 60);
        doc.text(`Completed Orders: ${completedOrders}`, 14, 70);
        doc.text(`Cancelled Orders: ${cancelledOrders}`, 14, 80);

        // Add Orders Breakdown table
        const tableData = orders.map((order) => [
            order.orderId,
            order.customerInfo.name,
            order.status,
            order.totalPrice.toFixed(2),
        ]);

        autoTable(doc, {
            head: [["Order ID", "Customer Name", "Status", "Total Price"]],
            body: tableData,
            startY: 90,
        });

        doc.save("custom_order_report.pdf");
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <AdminSideBar />

            {/* Main Content */}
            <div className="container-fluid" style={{ marginLeft: "16rem" }}>
                <h2 className="fw-bold mb-4">Customized Orders Report</h2>
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

                    {/* On Delivery Orders Card */}
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-muted">On Delivery Orders</h5>
                                <p className="card-text fs-4 text-info">{onDeliveryOrders}</p>
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

                    {/* Cancelled Orders Card */}
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title text-muted">Cancelled Orders</h5>
                                <p className="card-text fs-4 text-danger">{cancelledOrders}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Download Button */}
                <button onClick={downloadPDF} className="btn btn-primary mb-4">
                    Download Customized Orders Report
                </button>

                {/* Orders Breakdown Table */}
                <h3 className="fw-bold mb-3">Orders Breakdown</h3>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-secondary">
                            <tr>
                                <th>Order ID</th>
                                <th>Customer Name</th>
                                <th>Status</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order.orderId}</td>
                                    <td>{order.customerInfo.name}</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                order.status === "Completed"
                                                    ? "bg-success"
                                                    : order.status === "Pending"
                                                    ? "bg-warning text-dark"
                                                    : order.status === "On Delivery"
                                                    ? "bg-info text-dark"
                                                    : "bg-danger"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>LKR {order.totalPrice.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CustomOrderReport;