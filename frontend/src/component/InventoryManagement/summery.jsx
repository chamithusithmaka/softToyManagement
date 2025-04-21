import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import ManagerHeader from '../InventoryManagement/managerHeader';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const InventorySummaryReport = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: 'Inventory Summary Report',
    text: 'Please find attached the inventory summary report with current stock levels and financial analysis.'
  });

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
    doc.setFontSize(18);
    doc.text('Inventory Summary Report', 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 22);
    
    const summary = calculateSummary();
    let yPos = 30;

    // Calculate overall totals
    let overallTotalCost = 0;
    let overallTotalProfit = 0;

    Object.keys(summary).forEach((category, index) => {
      // Add some spacing between categories
      if (index > 0) {
        yPos += 10;
      }
      
      doc.setFontSize(14);
      doc.text(category, 14, yPos);
      yPos += 5;

      const tableData = summary[category].items.map((item) => [
        item.name,
        item.qty,
        item.buyingPrice.toFixed(2),
        item.price.toFixed(2),
        item.total.toFixed(2),
        item.profit.toFixed(2),
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['Item Name', 'Quantity', 'Buying Price (LKR)', 'Selling Price (LKR)', 'Total Cost (LKR)', 'Profit (LKR)']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [66, 139, 202], textColor: 255 }
      });

      yPos = doc.lastAutoTable.finalY + 5;
      
      doc.setFontSize(11);
      doc.text(`Category Total Cost: LKR ${summary[category].categoryTotal.toFixed(2)}`, 14, yPos);
      yPos += 5;
      doc.text(`Category Total Profit: LKR ${summary[category].categoryProfit.toFixed(2)}`, 14, yPos);
      yPos += 10;

      overallTotalCost += summary[category].categoryTotal;
      overallTotalProfit += summary[category].categoryProfit;
    });

    // Add overall summary
    yPos += 5;
    doc.setDrawColor(66, 139, 202);
    doc.setLineWidth(0.5);
    doc.line(14, yPos, 196, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.text('Overall Summary', 14, yPos);
    yPos += 8;

    doc.setFontSize(12);
    doc.text(`Total Inventory Value: LKR ${overallTotalCost.toFixed(2)}`, 14, yPos);
    yPos += 6;
    doc.text(`Total Potential Profit: LKR ${overallTotalProfit.toFixed(2)}`, 14, yPos);
    yPos += 8;

    // Add low stock items
    yPos += 5;
    const lowStockItems = items.filter((item) => item.qty < 3);
    
    if (lowStockItems.length > 0) {
      doc.setFontSize(14);
      doc.text('Low Stock Items (Quantity < 3)', 14, yPos);
      yPos += 5;

      const lowStockData = lowStockItems.map(item => [item.name, item.qty, item.category.name]);
      
      doc.autoTable({
        startY: yPos,
        head: [['Item Name', 'Quantity', 'Category']],
        body: lowStockData,
        theme: 'grid',
        headStyles: { fillColor: [217, 83, 79], textColor: 255 }
      });
    }

    return doc;
  };

  const downloadPDF = () => {
    const doc = generatePDF();
    doc.save('Inventory_Summary_Report.pdf');
  };

  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value
    });
  };

  const sendReportByEmail = async () => {
    // Validate email
    if (!emailData.to || !emailData.to.includes('@')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.'
      });
      return;
    }

    setIsSending(true);

    try {
      // Generate PDF
      const doc = generatePDF();
      const pdfBlob = doc.output('blob');

      // Create form data
      const formData = new FormData();
      formData.append('to', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('text', emailData.text);
      formData.append('file', pdfBlob, 'Inventory_Summary_Report.pdf');

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
        text: 'Inventory summary report has been sent successfully.',
        confirmButtonColor: '#0d6efd'
      });
    } catch (error) {
      console.error('Error sending email:', error);
      Swal.fire({
        icon: 'error',
        title: 'Email Failed',
        text: 'Failed to send the report email. Please try again.',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setIsSending(false);
    }
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
              <div>
                <button 
                  className="btn btn-secondary me-2" 
                  onClick={() => setShowEmailModal(true)}
                >
                  Email Report
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={downloadPDF}
                >
                  Download Report
                </button>
              </div>
            </div>

            <div className="card p-4 shadow-sm">
              {/* Summary Statistics Cards */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <h5 className="card-title">Total Items</h5>
                      <p className="card-text display-6">{items.length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <h5 className="card-title">Total Categories</h5>
                      <p className="card-text display-6">{Object.keys(calculateSummary()).length}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-danger text-white">
                    <div className="card-body">
                      <h5 className="card-title">Low Stock Items</h5>
                      <p className="card-text display-6">{items.filter(item => item.qty < 3).length}</p>
                    </div>
                  </div>
                </div>
              </div>

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

      {/* Email Modal */}
      <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Inventory Report</Modal.Title>
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
                placeholder="manager@example.com"
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
              A detailed PDF report of the inventory summary will be attached to this email.
            </small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={sendReportByEmail}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InventorySummaryReport;