import React, { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const MakeTransaction = ({ show, handleClose, onSuccess, bal }) => {
  const { id } = useParams();
  //Add Transaction logic
  const [value, setValue] = useState({
    amount: '',
    transactionType: '',
    paymentMethod: '',
    type: 'supplier',
    attachment: null,
    balance: '',
    description: '',
    CSId: id
  });

  const finalBal = (prevBal, amnt, tranType) => {
    prevBal = Number(prevBal); // Ensure prevBal is a number
    amnt = Number(amnt); // Ensure amnt is a number

    return tranType === 'credit' ? prevBal + amnt : prevBal - amnt;
  };

  //Image Logic
  const handleOnchange = (e) => {
    const { name, value: inputValue, files } = e.target;
    if (name === 'attachment' && files) {
      const file = files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.warning('Only JPEG and pdf files are allowed', { progressStyle: { background: 'black' } });
        return;
      }
    }
    setValue((prev) => ({
      ...prev,
      [name]: files ? files[0] : inputValue
    }));
  };

  const fileInputRef = useRef(null);

  const resetForm = () => {
    setValue({
      amount: '',
      transactionType: '',
      paymentMethod: '',
      attachment: null,
      description: '',
      balance: ''
    });
  };

  if (fileInputRef.current) {
    fileInputRef.current.value = '';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.keys(value).forEach((key) => {
        formData.append(key, value[key]);
      });
      for (let [key, val] of formData.entries()) {
        console.log(`${key}:`, val); // Debugging FormData
      }
      const res = await axios.post('http://localhost:8009/api/add-transaction', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        resetForm();
        onSuccess(); // Wait for the toast to show before closing
      } else {
        toast.error(res.data.message || 'An error occurred');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Server error occurred');
      } else {
        toast.error('Internal server error');
      }
      console.error(error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="theme-bg">
          <Modal.Title style={{ color: 'white' }}>Make Transaction</Modal.Title>
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
                      id="name"
                      autoComplete="amount"
                      placeholder="Enter Amount..."
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Transaction Type</Form.Label>
                    <Form.Control as="select" name="transactionType" onChange={handleOnchange} value={value.transactionType}>
                      <option value="">--Transaction-Type--</option>
                      <option value="debit" className="text-c-red">
                        Payment
                      </option>
                      <option value="credit" className="text-c-green">
                        Purchase
                      </option>
                    </Form.Control>
                  </Col>
                </Form.Group>

                <Form.Group className="mb-3 row">
                  <Col md={6}>
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Control as="select" name="paymentMethod" onChange={handleOnchange} value={value.paymentMethod}>
                      <option value="">--Payment-Method--</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">Upi</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </Form.Control>
                  </Col>
                  <Col md={6}>
                    <Form.Label>Attechment</Form.Label>
                    <Form.Control
                      name="attachment"
                      ref={fileInputRef}
                      onChange={handleOnchange}
                      value=""
                      id="attachment"
                      autoComplete="attachment"
                      type="file"
                    />
                  </Col>
                </Form.Group>

                <Form.Group className="mb-3 row">
                  <Col md={12}>
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
                  <Button variant="primary" className="theme-bg" type="submit">
                    Submit
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      resetForm();
                      handleClose();
                    }}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default MakeTransaction;
