import React, { useState, useRef } from 'react';
import { Button, Modal, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaFileImage, FaBuilding, FaMapMarkerAlt, FaCity, FaMapPin, FaFileInvoice } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useData } from './Customer';

const AddCustomers = ({ show, handleClose }) => {
  const [showExtraFields, setShowExtraFields] = useState(false);
  const handleCheckboxChange = () => setShowExtraFields(prev => !prev);
  
  const [value, setValue] = useState({
    name: '',
    mobile: '',
    email: '',
    profilePic: null,
    GSTIN: '',
    flatBuildingNo: '',
    areaLocality: '',
    pincode: '',
    city: '',
    state: ''
  });

  const handleOnChange = (e) => {
    const { name, value: inputValue, files } = e.target;
    if (name === 'profilePic' && files) {
      const file = files[0];
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.warning('Only JPEG and PNG files are allowed');
        return;
      }
    }
    setValue(prev => ({ ...prev, [name]: files ? files[0] : inputValue }));
  };

  const fileInputRef = useRef(null);
  const resetForm = () => {
    setValue({ name: '', mobile: '', email: '', profilePic: null, GSTIN: '', flatBuildingNo: '', areaLocality: '', pincode: '', city: '', state: '' });
  };
  
  if (fileInputRef.current) fileInputRef.current.value = '';
  
  const { addPost } = useData();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      Object.keys(value).forEach(key => formData.append(key, value[key]));
      
      const res = await axios.post('http://localhost:8009/api/add-customer', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.status === 201) {
        toast.success(res.data.message);
        addPost(res.data.customer);
        resetForm();
        handleClose();
      } else {
        toast.error(res.data.message || 'An error occurred');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error occurred');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="theme-bg text-white">
        <Modal.Title>Add Customer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaUser /></InputGroup.Text>
                  <Form.Control type="text" name="name" value={value.name} onChange={handleOnChange} placeholder="Enter Full Name..." required />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                  <Form.Control type="email" name="email" value={value.email} onChange={handleOnChange} placeholder="Enter Your Email..." required />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mobile</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaPhone /></InputGroup.Text>
                  <Form.Control type="number" name="mobile" value={value.mobile} onChange={handleOnChange} placeholder="Enter Mobile No..." required />
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Profile Picture</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaFileImage /></InputGroup.Text>
                  <Form.Control type="file" name="profilePic" ref={fileInputRef} onChange={handleOnChange} />
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Form.Check type="checkbox" label="Add more details (Address & GST No)" className="mt-3" onChange={handleCheckboxChange} checked={showExtraFields} />

          {showExtraFields && (
            <Row className="g-3 mt-2">
              <Col md={6}><InputGroup><InputGroup.Text><FaFileInvoice /></InputGroup.Text><Form.Control type="text" name="GSTIN" value={value.GSTIN} onChange={handleOnChange} placeholder="GST No..." /></InputGroup></Col>
              <Col md={6}><InputGroup><InputGroup.Text><FaBuilding /></InputGroup.Text><Form.Control type="text" name="flatBuildingNo" value={value.flatBuildingNo} onChange={handleOnChange} placeholder="Flat/Building No..." /></InputGroup></Col>
              <Col md={6}><InputGroup><InputGroup.Text><FaMapMarkerAlt /></InputGroup.Text><Form.Control type="text" name="areaLocality" value={value.areaLocality} onChange={handleOnChange} placeholder="Area/Locality..." /></InputGroup></Col>
              <Col md={6}><InputGroup><InputGroup.Text><FaMapPin /></InputGroup.Text><Form.Control type="number" name="pincode" value={value.pincode} onChange={handleOnChange} placeholder="Pincode..." /></InputGroup></Col>
              <Col md={6}><InputGroup><InputGroup.Text><FaCity /></InputGroup.Text><Form.Control type="text" name="city" value={value.city} onChange={handleOnChange} placeholder="City..." /></InputGroup></Col>
              <Col md={6}><InputGroup><InputGroup.Text><FaMapPin /></InputGroup.Text><Form.Control type="text" name="state" value={value.state} onChange={handleOnChange} placeholder="State..." /></InputGroup></Col>
            </Row>
          )}

          <Modal.Footer>
            <Button variant="primary" className="theme-bg" type="submit">Submit</Button>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddCustomers;