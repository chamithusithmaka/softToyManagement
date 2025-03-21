import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const DeleteDriver = ({ match }) => {
    const [driver, setDriver] = useState(null);

    useEffect(() => {
        fetchDriver();
    }, []);

    const fetchDriver = async () => {
        try {
            const response = await axios.get(`http://localhost:5555/api/drivers/${match.params.id}`);
            setDriver(response.data);
        } catch (error) {
            console.error('Error fetching driver', error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/drivers/${match.params.id}`);
            alert('Driver deleted successfully');
        } catch (error) {
            console.error('Error deleting driver', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Delete Driver</h2>
            {driver && (
                <div>
                    <p>Are you sure you want to delete the driver {driver.name}?</p>
                    <button className="btn btn-danger" onClick={handleDelete}>Delete Driver</button>
                </div>
            )}
        </div>
    );
};

export default DeleteDriver;