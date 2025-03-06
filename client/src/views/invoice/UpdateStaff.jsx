import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const UpdateStaff = ({ show, handleUclose, staffUid }) => {
  const emptyStaff = {
    name: '',
    email: '',
    mobile: '',
    address: '',
    desigination: ''
  };
  const [staff, setStaff] = useState(emptyStaff);

  const handleinputChange = (e) => {
    const { name, value } = e.target;
    setStaff({ ...staff, [name]: value });
  };

  const fetchStaffData = async () => {
    try {
      const res = await axios.get(`/api/getstaff?staffId=${staffUid}`);
      setStaff(res.data.staffs); // Make sure this matches the response data structure
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch staff data.');
    }
  };
  // Get staff by Id
  useEffect(() => {
    if (staffUid) {
      fetchStaffData();
    }
  }, [staffUid]);

  const handleUpdClose = () => {
    handleUclose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/updatestaff/${staffUid}`, staff,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        handleUclose();
      } else {
        toast.error(res.data.message);
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

  if (!staff) {
    return null; // Return null or a loading indicator until the student data is fetched
  }

  return (
    <>
      <Modal show={show} onHide={handleUpdClose}>
        <Modal.Header closeButton className="theme-bg">
          <Modal.Title style={{ color: 'white' }}>Update Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 row">
                  <Form.Group className="col-12 col-md-6 mb-3 mb-md-0">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={staff.name}
                      onChange={handleinputChange}
                      id="name"
                      autoComplete="name"
                      placeholder="Enter Full Name..."
                      required
                    />
                  </Form.Group>
                  <Form.Group className="col-12 col-md-6">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={staff.email}
                      onChange={handleinputChange}
                      autoComplete="email"
                      id="email"
                      placeholder="Enter Email..."
                      required
                    />
                  </Form.Group>
                </Form.Group>

                <Form.Group className="mb-3 row">
                  <Form.Group className="col-12 col-md-6 mb-3 mb-md-0">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control
                      type="number"
                      name="mobile"
                      value={staff.mobile}
                      onChange={handleinputChange}
                      autoComplete="mobile"
                      id="mobile"
                      placeholder="Enter Your Mobile..."
                      required
                    />
                  </Form.Group>
                  <Form.Group className="col-12 col-md-6">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={staff.address}
                      onChange={handleinputChange}
                      id="address"
                      autoComplete="address"
                      placeholder="Address..."
                      required
                    />
                  </Form.Group>
                </Form.Group>

                <Form.Group className="col-12 col-md-12 mb-3 mb-md-3">
                  <Form.Label>Desigination</Form.Label>
                  <Form.Control
                    type="text"
                    name="desigination"
                    value={staff.desigination}
                    onChange={handleinputChange}
                    id="desigination"
                    autoComplete="desigination"
                    placeholder="Enter Your desigination..."
                    required
                  />
                </Form.Group>

                <Modal.Footer>
                  <Button variant="primary" className="theme-bg" type="submit">
                    Submit
                  </Button>
                  <Button variant="secondary" onClick={handleUpdClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UpdateStaff;
