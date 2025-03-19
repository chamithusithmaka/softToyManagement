import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import ManagerHeader from '../InventoryManagement/managerHeader';

const InventorySummaryReport = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5555/inventory-items');
        setItems(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching inventory items');
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const calculateSummary = () => {
    const summary = {};

    items.forEach((item) => {
      const { category, name, qty, buyingPrice, price } = item;
      const total = qty * buyingPrice;
      const profit = (price - buyingPrice) * qty;

      if (!summary[category.name]) {
        summary[category.name] = {
          items: [],
          categoryTotal: 0,
          categoryProfit: 0,
        };
      }

      summary[category.name].items.push({
        name,
        qty,
        buyingPrice,
        price,
        total,
        profit,
      });

      summary[category.name].categoryTotal += total;
      summary[category.name].categoryProfit += profit;
    });

    return summary;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Inventory Summary Report', 14, 10);
    const summary = calculateSummary();

    Object.keys(summary).forEach((category, index) => {
      const yPos = 20 + index * 50;
      doc.text(category, 14, yPos);

      const tableData = summary[category].items.map((item) => [
        item.name,
        item.qty,
        item.buyingPrice.toFixed(2),
        item.price.toFixed(2),
        item.total.toFixed(2),
        item.profit.toFixed(2),
      ]);

      doc.autoTable({
        startY: yPos + 5,
        head: [['Item Name', 'Quantity', 'Buying Price (LKR)', 'Selling Price (LKR)', 'Total Cost (LKR)', 'Profit (LKR)']],
        body: tableData,
      });

      doc.text(`Category Total Cost: LKR ${summary[category].categoryTotal.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);
      doc.text(`Category Total Profit: LKR ${summary[category].categoryProfit.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 15);
    });

    doc.save('Inventory_Summary_Report.pdf');
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-danger text-center mt-4">{error}</div>;
  }

  return (
    <div className="d-flex">
      <ManagerHeader />

      <div className="container-fluid" style={{ marginLeft: '16rem' }}>
        <div className="row justify-content-center mt-4">
          <div className="col-lg-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="text-center">Inventory Summary Report</h1>
              <button className="btn btn-primary" onClick={generatePDF}>
                Download Summary Report
              </button>
            </div>

            <div className="card p-4 shadow-sm">
              {Object.keys(calculateSummary()).map((category) => (
                <div key={category} className="mb-4">
                  <h2 className="h5 text-dark">{category}</h2>
                  <table className="table table-bordered mt-3">
                    <thead className="table-light">
                      <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Buying Price (LKR)</th>
                        <th>Selling Price (LKR)</th>
                        <th>Total Cost (LKR)</th>
                        <th>Profit (LKR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculateSummary()[category].items.map((item, index) => (
                        <tr key={index} className={item.qty < 3 ? 'table-danger' : ''}>
                          <td>{item.name}</td>
                          <td>{item.qty}</td>
                          <td>{item.buyingPrice.toFixed(2)}</td>
                          <td>{item.price.toFixed(2)}</td>
                          <td>{item.total.toFixed(2)}</td>
                          <td>{item.profit.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-3">
                    <p>
                      <strong>Category Total Cost: </strong>LKR{' '}
                      {calculateSummary()[category].categoryTotal.toFixed(2)}
                    </p>
                    <p>
                      <strong>Category Total Profit: </strong>LKR{' '}
                      {calculateSummary()[category].categoryProfit.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="mt-5">
                <h3 className="h6 text-dark">Low Stock Items</h3>
                <ul className="list-group mt-2">
                  {items
                    .filter((item) => item.qty < 3)
                    .map((item) => (
                      <li key={item._id} className="list-group-item">
                        {item.name} - Quantity: {item.qty}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventorySummaryReport;
