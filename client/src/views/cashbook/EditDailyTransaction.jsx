import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const EditDailyTransaction = ({ show, onSuccess, editId, handleClose }) => {
  const [transaction, setTransaction] = useState({
    amount: '',
    mode_of_payment: '',
    description: ''
  });

  useEffect(() => {
    if (editId) fetchTransaction();
  }, [editId]);

  const fetchTransaction = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8009/api/getexpense?id=${editId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransaction(res.data.data[0]);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch transaction.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:8009/api/editexpense/${editId}`, transaction, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 201) {
        toast.success(res.data.message);
        onSuccess(); // Trigger re-fetch in Cashbook
        handleClose();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data.message || 'Server error occurred');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="theme-bg">
        <Modal.Title style={{ color: 'white' }}>Update Daily Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 row">
                <Col md={6}>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    name="amount"
                    value={transaction.amount}
                    onChange={handleInputChange}
                    placeholder="Enter Amount"
                    type="text"
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Mode of Payment</Form.Label>
                  <Form.Control as="select" name="mode_of_payment" onChange={handleInputChange} value={transaction.mode_of_payment}>
                    <option value="">--Mode-of-Payment--</option>
                    <option value="cash">Cash</option>
                    <option value="upi">Online</option>
                  </Form.Control>
                </Col>
              </Form.Group>

              <Form.Group className="col-12 col-md-12 mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={transaction.description}
                  onChange={handleInputChange}
                  placeholder="Enter description..."
                  required
                />
              </Form.Group>

              <Modal.Footer>
                <Button variant="primary" className="theme-bg" type="submit">
                  Submit
                </Button>
                <Button variant="secondary" onClick={handleClose}>
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

export default EditDailyTransaction;
