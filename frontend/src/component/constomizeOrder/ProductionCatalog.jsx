import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../home/HomeHeader"; // Import the Header component

const ProductionCatalog = () => {
    const [items, setItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch all inventory items
    useEffect(() => {
        const fetchInventoryItems = async () => {
            try {
                const response = await axios.get("http://localhost:5555/store-items");
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching inventory items:", error);
                setErrorMessage("Failed to fetch inventory items. Please try again later.");
            }
        };

        fetchInventoryItems();
    }, []);

    return (
        <div>
            {/* Header */}
            <Header />

            {/* Main Content */}
            <div className="container mt-5">
                <h2 className="text-center mb-4"> Inventory Items</h2>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-primary">
                            <tr>
                                <th>Photo</th>
                                <th>Name</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length > 0 ? (
                                items.map((item) => (
                                    <tr key={item._id}>
                                        <td>
                                            {item.photo ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${item.photo}`}
                                                    alt={item.name}
                                                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                />
                                            ) : (
                                                "No Image"
                                            )}
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        No items found.
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

export default ProductionCatalog;