import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSideBar from "./adminSideBar";

const AllCustomOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

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
                            return { ...order, deliveryStatus: "N/A" }; // Default to "N/A" if status fetch fails
                        }
                    })
                );

                // Filter out orders with delivery status "N/A"
                const validOrders = ordersWithStatus.filter(order => order.deliveryStatus !== "N/A");

                setOrders(validOrders);
                setFilteredOrders(validOrders); // Initialize filtered orders
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

        // Filter orders by Order ID
        const filtered = orders.filter((order) =>
            order.orderId.toLowerCase().includes(query)
        );
        setFilteredOrders(filtered);
    };

    // Handle view button click
    const handleViewOrder = (orderId) => {
        navigate(`/admin-order-details/${orderId}`); // Navigate to the order details page
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <AdminSideBar />

            {/* Main Content */}
            <div className="container-fluid" style={{ marginLeft: "16rem" }}>
                <h2 className="text-center mb-4">All Customized Orders</h2>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                {/* Search Bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Order ID"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
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
                                <th>Status</th>
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
                                        <td>{order.totalPrice}</td>
                                        <td>{order.status}</td>
                                        <td>{order.deliveryStatus}</td>
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
        </div>
    );
};

export default AllCustomOrders;