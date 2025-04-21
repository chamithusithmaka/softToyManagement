import React, { useState } from 'react';
import axios from 'axios';
import ManagerHeader from './managerHeader';

function OrderEmail() {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    text: '',
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('to', emailData.to);
    formData.append('subject', emailData.subject);
    formData.append('text', emailData.text);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post('http://localhost:5555/api/send-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error sending email:', error);
      setMessage('Failed to send email.');
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <ManagerHeader />

      {/* Main Content */}
      <div className="container-fluid" style={{ marginLeft: '16rem' }}>
        <h2 className="fw-bold mb-4">Send Email</h2>
        <div className="card shadow p-4">
          {message && <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label htmlFor="to" className="form-label">To</label>
              <input
                type="email"
                className="form-control"
                id="to"
                name="to"
                value={emailData.to}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="subject" className="form-label">Subject</label>
              <input
                type="text"
                className="form-control"
                id="subject"
                name="subject"
                value={emailData.subject}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="text" className="form-label">Message</label>
              <textarea
                className="form-control"
                id="text"
                name="text"
                rows="4"
                value={emailData.text}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="file" className="form-label">Attachment</label>
              <input
                type="file"
                className="form-control"
                id="file"
                onChange={handleFileChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Send Email</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OrderEmail;