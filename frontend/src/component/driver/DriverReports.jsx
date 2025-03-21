import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import AdminSideBar from "../delivery/managerHeader";

function DriverRoutesReport() {
    const [drivers, setDrivers] = useState([]);
    const [vehicleCounts, setVehicleCounts] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await axios.get("http://localhost:5555/api/drivers");
                setDrivers(response.data);
                
                const counts = response.data.reduce((acc, driver) => {
                    acc[driver.vehicleType] = (acc[driver.vehicleType] || 0) + 1;
                    return acc;
                }, {});
                setVehicleCounts(counts);
            } catch (error) {
                console.error("Error fetching drivers:", error);
            }
        };

        fetchDrivers();
    }, []);

    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Driver Routes Report", 14, 20);

        const date = new Date();
        const formattedDate = date.toLocaleString();

        doc.setFontSize(12);
        doc.text(`Generated on: ${formattedDate}`, 14, 30);

        const tableData = drivers.map((driver) => [
            driver.name,
            driver.address,
            driver.phone,
            driver.nic,
            driver.vehicleType,
            driver.vehicleNo,
            driver.licenseNo,
        ]);

        autoTable(doc, {
            head: [["Name", "Address", "Phone", "NIC", "Vehicle Type", "Vehicle No", "License No"]],
            body: tableData,
            startY: 40,
        });

        doc.save("driver_routes_report.pdf");
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
            <AdminSideBar />
            <div className="container-fluid" style={{ marginLeft: "16rem" }}>
                <h2 className="fw-bold mb-4">Driver Routes Report</h2>
                <div className="row mb-4">
                    {Object.entries(vehicleCounts).map(([vehicleType, count]) => (
                        <div className="col-md-3" key={vehicleType}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-muted">{vehicleType}</h5>
                                    <p className="card-text fs-4 text-primary">{count} Drivers</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Search by Name, Vehicle Type, NIC, Address, Vehicle No, License No"
                    className="form-control mb-3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={downloadPDF} className="btn btn-primary mb-4">
                    Download Drivers Report
                </button>
                <h3 className="fw-bold mb-3">Driver Details</h3>
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
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDrivers.map((driver) => (
                                <tr key={driver._id}>
                                    <td>{driver.name}</td>
                                    <td>{driver.address}</td>
                                    <td>{driver.phone}</td>
                                    <td>{driver.nic}</td>
                                    <td>{driver.vehicleType}</td>
                                    <td>{driver.vehicleNo}</td>
                                    <td>{driver.licenseNo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DriverRoutesReport;
