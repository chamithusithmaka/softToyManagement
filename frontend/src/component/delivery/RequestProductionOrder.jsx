import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';
import ManagerHeader from './managerHeader';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';

const RequestProductionOrders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: 'Request for Production Completed Orders',
    text: `Dear Production Manager,

I am writing to request the status of all completed orders that are ready for delivery. Please provide information about any orders that have been produced and are awaiting shipment.

Kind regards,
Delivery Management Team`
  });
  
  const [priorityLevel, setPriorityLevel] = useState('normal');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData({
      ...emailData,
      [name]: value
    });
  };

  const sendRequest = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!emailData.to || !emailData.to.includes('@')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('to', emailData.to);
      
      // Add priority level to subject
      formData.append('subject', `[${priorityLevel.toUpperCase()}] ${emailData.subject}`);
      formData.append('text', emailData.text);
      
      // Send email
      const response = await axios.post('http://localhost:5555/api/send-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      Swal.fire({
        icon: 'success',
        title: 'Request Sent!',
        text: 'Your request for production orders has been sent successfully.',
        confirmButtonColor: '#28a745'
      });
      
    } catch (error) {
      console.error('Error sending email request:', error);
      Swal.fire({
        icon: 'error',
        title: 'Request Failed',
        text: 'Failed to send the request. Please try again later.',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <ManagerHeader />
      
      <div className="container mt-4" style={{ marginLeft: '16rem', maxWidth: 'calc(100% - 16rem)' }}>
        <h2 className="mb-4">Request Production Orders</h2>
        
        <div className="row justify-content-center">
          <div className="col-md-9">
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-primary text-white">
                <FaEnvelope className="me-2" /> Email Request Form
              </Card.Header>
              <Card.Body>
                <Form onSubmit={sendRequest}>
                  <Form.Group className="mb-3">
                    <Form.Label>Production Manager Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="to"
                      value={emailData.to}
                      onChange={handleInputChange}
                      placeholder="production.manager@example.com"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={emailData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Priority Level</Form.Label>
                    <Form.Select 
                      value={priorityLevel} 
                      onChange={(e) => setPriorityLevel(e.target.value)}
                    >
                      <option value="normal">Normal</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="low">Low</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="text"
                      value={emailData.text}
                      onChange={handleInputChange}
                      rows={6}
                      required
                    />
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isLoading}
                    className="d-flex align-items-center"
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="me-2" /> Send Request
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </div>
        
        <div className="row justify-content-center mb-5">
          <div className="col-md-9">
            <Card className="shadow-sm">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Email Template Suggestions</h5>
              </Card.Header>
              <Card.Body>
                <div className="row">
                  <div className="col-md-6">
                    <Button 
                      variant="outline-secondary" 
                      className="mb-2 w-100 text-start"
                      onClick={() => setEmailData({
                        ...emailData,
                        subject: 'Urgent: Request for Production Completed Orders',
                        text: `Dear Production Manager,

We urgently need to know if there are any completed toy orders ready for pickup and delivery. Our delivery schedule has openings today and tomorrow.

Please respond at your earliest convenience with the list of orders that are ready to ship.

Thank you for your prompt attention to this matter.

Best regards,
Delivery Management Team`
                      })}
                    >
                      Load Urgent Request Template
                    </Button>
                  </div>
                  <div className="col-md-6">
                    <Button 
                      variant="outline-secondary" 
                      className="mb-2 w-100 text-start"
                      onClick={() => setEmailData({
                        ...emailData,
                        subject: 'Weekly Request for Completed Production Orders',
                        text: `Dear Production Team,

This is our weekly request for information on completed orders that are ready for delivery scheduling.

We are currently planning routes for next week and would like to include any newly completed toys in our delivery schedule.

Please provide a list of order IDs that are ready for pickup at your earliest convenience.

Thank you for your assistance.

Kind regards,
Delivery Management`
                      })}
                    >
                      Load Weekly Request Template
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestProductionOrders;