import React, { useState } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

const ResetOtpverify = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    setOtp(value);
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP', { position: 'top-center' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8009/api/reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: localStorage.getItem('resetEmail'), otp })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || 'OTP verification failed');
      }

      toast.success('OTP Verified Successfully!', { position: 'top-center' });

      setTimeout(() => {
        history('/auth/change-password');
      }, 3000);
    } catch (error) {
      toast.error(error.message, { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
                <i className="feather icon-unlock auth-icon" />
              </div>
              <h3 className="mb-2">OTP Verification</h3>
              <h6 className="mb-4">For Reset Password</h6>
              <form onSubmit={verifyOtp}>
                <div className="form-group mb-4">
                  <Form.Control
                    className="form-control text-center"
                    value={otp}
                    name="otp"
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP"
                    type="number"
                    maxLength="6"
                    disabled={loading}
                  />
                </div>
                <Row>
                  <Col mt={2}>
                    <Button className="btn-block mb-4" color="primary" size="large" type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </Button>
                  </Col>
                </Row>
              </form>
              <ToastContainer />
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ResetOtpverify;
