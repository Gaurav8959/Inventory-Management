import React, { useState } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

const ResetPasswordEmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const sendResetEmail = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required!", { position: "top-center" });
      return;
    }

    if (!email.includes("@")) {
      toast.warning("Please enter a valid email!", { position: "top-center" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8009/api/emailforgetpass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to send reset email");
      }

      toast.success("OTP sent to your email!", { position: "top-center" });

      localStorage.setItem("resetEmail", email);

      setTimeout(() => {
        navigate("/auth/otp-password");
      }, 3000);
    } catch (error) {
      toast.error(error.message, { position: "top-center" });
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
                <i className="feather icon-mail auth-icon" />
              </div>
              <h3 className="mb-4">Reset Password</h3>
              <p>Enter your email to receive an OTP for password reset.</p>
              <form onSubmit={sendResetEmail}>
                <div className="form-group mb-4">
                  <Form.Control
                    className="form-control text-center"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    type="email"
                    disabled={loading}
                  />
                </div>
                <Row>
                  <Col mt={2}>
                    <Button
                      className="btn-block mb-4"
                      color="primary"
                      size="large"
                      type="submit"
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </Button>
                  </Col>
                </Row>
              </form>
              <p className="mb-2">
                Remember your password?{" "}
                <NavLink to={'/auth/signin-1'} className="f-w-400">
                  Login
                </NavLink>
              </p>
              <ToastContainer />
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ResetPasswordEmail;
