import React, { useState, useRef } from 'react';
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useData } from './Cashbook';
const AddCash = ({ show, handleClose, bal }) => {
  //Add Customer logic
  const [value, setValue] = useState({
    amount: '',
    transactionType: '',
    balance: '',
    mode_of_payment: '',
    description: ''
  });

  //Image Logic
  const handleOnchange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    });
  };

  const finalBal = (prevBal, amnt, tranType) => {
    prevBal = Number(prevBal); // Ensure prevBal is a number
    amnt = Number(amnt); // Ensure amnt is a number

    return tranType === 'credit' ? prevBal + amnt : prevBal - amnt;
  };

  const resetForm = () => {
    setValue({
      amount: '',
      transactionType: '',
      balance: '',
      mode_of_payment: '',
      description: ''
    });
  };

  const { fetchData } = useData();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8009/api/cashbook', value, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        toast.success(res.data.message);
        fetchData(); // Refresh data
        resetForm();
        handleClose(); // Close modal
      } else {
        toast.error(res.data.message || 'An error occurred');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error');
      console.error(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="theme-bg3">
        <Modal.Title style={{ color: 'white' }}>Add Cash</Modal.Title>
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
                    value={value.amount}
                    onChange={handleOnchange}
                    id="amount"
                    autoComplete="amount"
                    placeholder="Enter Amount..."
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Transaction Type</Form.Label>
                  <Form.Control as="select" name="transactionType" onChange={handleOnchange} value={value.transactionType}>
                    <option value="">--Transaction-Type--</option>
                    <option value="credit" className="text-c-green">
                      IN
                    </option>
                    <option value="debit" className="text-c-red">
                      OUT
                    </option>
                  </Form.Control>
                </Col>
              </Form.Group>

              <Form.Group className="mb-3 row">
                <Col md={6}>
                  <Form.Label>Mode of Payment</Form.Label>
                  <Form.Control as="select" name="mode_of_payment" onChange={handleOnchange} value={value.mode_of_payment}>
                    <option value="">--Mode-of-Payment--</option>
                    <option value="cash">Cash</option>
                    <option value="upi">Online</option>
                  </Form.Control>
                </Col>
                <Col md={6}>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    name="description"
                    value={value.description}
                    onChange={handleOnchange}
                    id="description"
                    autoComplete="description"
                    type="text"
                  />
                </Col>
              </Form.Group>

              {value.transactionType
                ? ((value.balance = finalBal(bal, value.amount, value.transactionType)),
                  (
                    <Form.Group className="mb-3 row">
                      <Col md={12}>
                        <Form.Label>Balance</Form.Label>
                        <Form.Control
                          name="balance"
                          value={value.balance}
                          onChange={handleOnchange}
                          id="balance"
                          autoComplete="balance"
                          type="number"
                        />
                      </Col>
                    </Form.Group>
                  ))
                : ''}

              <Modal.Footer>
                <Button variant="primary" className="theme-bg3" type="submit">
                  Submit
                </Button>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Modal.Body>
    </Modal>
  );
};

export default AddCash;
