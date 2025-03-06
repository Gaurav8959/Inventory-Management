import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';


const SetDate = ({ show, handleUclose, setDateid, onSuccess  }) => {
  const [date, setDate] = useState({
    collectionDate: '',
    transactionId: setDateid,
  });

  // ✅ Reset form when modal opens
  useEffect(() => {
    if (show) {
      setDate({
        collectionDate: '',
        transactionId: setDateid,
      });
    }
  }, [show, setDateid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDate((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseAndReset = () => {
    setDate({
      collectionDate: '',
      transactionId: setDateid,
    });
    handleUclose(); // Call the parent close function
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:8009/api/setcollectiondate',
        date,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        handleCloseAndReset();
        onSuccess();
        
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error occurred');
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={handleCloseAndReset}>
      <Modal.Header closeButton className="theme-bg">
        <Modal.Title style={{ color: 'white' }}>Set Collection Date</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="col-12 col-md-12 mb-3 mb-md-3">
                <Form.Label>Set Date</Form.Label>
                <Form.Control
                  type="date"
                  name="collectionDate"
                  value={date.collectionDate}
                  onChange={handleInputChange}
                  id="date"
                  autoComplete="date"
                  required
                />
              </Form.Group>
              <Modal.Footer>
                <Button variant="primary" className="theme-bg" type="submit">
                  Submit
                </Button>
                <Button variant="secondary" onClick={handleCloseAndReset}>
                  Close
                </Button>
              </Modal.Footer>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default SetDate;
