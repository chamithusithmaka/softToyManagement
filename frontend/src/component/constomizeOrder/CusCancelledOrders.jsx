import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSideBar from "./adminSideBar";

const CusCancel = () => {
    const [orders, setOrders] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchCancelledOrders = async () => {
            try {
                console.log("Fetching all orders...");
                // Fetch all orders
                const response = await axios.get("http://localhost:5555/api/costomorders");
                const fetchedOrders = response.data;
                console.log("Fetched orders:", fetchedOrders);

                // Fetch delivery status for each order
                console.log("Fetching delivery statuses for orders...");
                const ordersWithStatus = await Promise.all(
                    fetchedOrders.map(async (order) => {
                        try {
                            const statusResponse = await axios.get(
                                `http://localhost:5555/api/delivery/status/${order.orderId}`
                            );
                            console.log(`Fetched delivery status for order ${order.orderId}:`, statusResponse.data.status);
                            return { ...order, deliveryStatus: statusResponse.data.status };
                        } catch (error) {
                            console.error(`Error fetching delivery status for order ${order.orderId}:`, error);
                            return { ...order, deliveryStatus: "N/A" }; // Default to "N/A" if status fetch fails
                        }
                    })
                );

                console.log("Orders with delivery statuses:", ordersWithStatus);

                // Filter only cancelled orders
                const cancelledOrders = ordersWithStatus.filter(
                    (order) => order.deliveryStatus === "Cancelled"
                );
                console.log("Cancelled orders:", cancelledOrders);

                setOrders(cancelledOrders);
            } catch (error) {
                console.error("Error fetching cancelled orders:", error);
                setErrorMessage("Failed to fetch cancelled orders. Please try again later.");
            }
        };

        fetchCancelledOrders();
    }, []);

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <AdminSideBar />

            {/* Main Content */}
            <div className="container-fluid" style={{ marginLeft: "16rem" }}>
                <h2 className="text-center mb-4">Cancelled Orders</h2>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
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
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order.orderId}</td>
                                        <td>{order.customerInfo.name}</td>
                                        <td>{order.toyType}</td>
                                        <td>{order.quantity}</td>
                                        <td>{order.totalPrice}</td>
                                        <td>{order.status}</td>
                                        <td>{order.deliveryStatus}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No cancelled orders found.
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

export default CusCancel;