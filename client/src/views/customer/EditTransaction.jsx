import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import moment from 'moment';

const UpdateTransaction = ({ show, handleClose, onSuccess, transactionUid }) => {
  const transactionData = {
    amount: '',
    description: '',
    currentDate: '',
    paymentMethod: '',
    attachment: null
  };

  const [transaction, setTransaction] = useState(transactionData);
  const [attachment, setAttachment] = useState(null);
  const [previewattachment, setPreviewattachment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      console.log(transactionUid)
      const response = await axios.get(`http://localhost:8009/api/getparticulartransaction/${transactionUid}`);
      console.log(response.data.result)
        setTransaction(response.data.result[0]);
        setPreviewattachment(response.data.result[0].attachment || null);
    } catch (error) {
      console.error(error.message);
      //setTransaction(transactionData); // Reset to default if an error occurs
    }
  };

  useEffect(() => {
    if (show && transactionUid) {
      fetchData();
    }
  }, [show, transactionUid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAttachment(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewattachment(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      const fullTimestamp = moment(transaction.currentDate).format('YYYY-MM-DD HH:mm:ss');
      formData.append('amount', transaction.amount);
      formData.append('description', transaction.description);
      formData.append('currentDate', fullTimestamp);
      formData.append('paymentMethod', transaction.paymentMethod);

      if (attachment) {
        formData.append('attachment', attachment);
      }

      const res = await axios.put(`/api/edit-transaction/${transactionUid}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        setTransaction(res.data);
        setPreviewattachment(res.data.attachment);
        handleClose();
        onSuccess();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Internal server error');
    }
    setIsLoading(false);
  };

  if (!show) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="theme-bg">
        <Modal.Title style={{ color: 'white' }}>Update Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 row">
                <Col md={6}>
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={transaction.amount}
                    onChange={handleInputChange}
                    placeholder="Enter Amount..."
                    autoComplete="amount"
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="currentDate"
                    value={transaction.currentDate ? moment(transaction.currentDate).format('YYYY-MM-DDTHH:mm') : ''}
                    onChange={handleInputChange}
                    autoComplete="date"
                  />
                </Col>
              </Form.Group>

              <Form.Group className="mb-3 row">
                <Col md={6}>
                  <Form.Label>Attachment</Form.Label>
                  <Form.Control type="file" name="attachment" onChange={handleFileChange} autoComplete="attachment" />
                  {previewattachment && (
                    <img src={previewattachment} alt="Preview" width="120px" height="120px" className="mt-2 rounded" />
                  )}
                </Col>
                <Col md={6}>
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Control as="select" name="paymentMethod" onChange={handleInputChange} value={transaction.paymentMethod}>
                    <option value="">--Payment-Method--</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">Upi</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </Form.Control>
                </Col>
              </Form.Group>

              <Form.Group className="mb-3 row">
                <Col md={12}>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    name="description"
                    value={transaction.description}
                    onChange={handleInputChange}
                    autoComplete="description"
                    type="text"
                  />
                </Col>
              </Form.Group>

              <Modal.Footer>
                <Button variant="primary" className="theme-bg" type="submit" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Submit'}
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

export default UpdateTransaction;