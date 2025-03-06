import React, { useState } from "react";
import { Row, Col, Card, Button, Form, NavLink } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Breadcrumb from "../../../layouts/AdminLayout/Breadcrumb";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Toggle password visibility
  const toggleNewPassword = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Both fields are required!", { position: "top-center" });
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long", { position: "top-center" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-center" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8009/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: localStorage.getItem("resetEmail"), newPassword: newPassword }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to change password");
      }

      toast.success("Password changed successfully!", { position: "top-center" });
      localStorage.removeItem('resetEmail');

      setTimeout(() => {
        navigate("/auth/signin-1"); // Redirect to login after 2 seconds
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
                <i className="feather icon-lock auth-icon" />
              </div>
              <h3 className="mb-4">Change Password</h3>
              <form onSubmit={handleSubmit}>
                {/* New Password */}
                <div className="form-group mb-3 position-relative">
                  <Form.Control
                    className="form-control"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    autoComplete="newpassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                    onClick={toggleNewPassword}
                    style={{ cursor: "pointer" }}
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {/* Confirm Password */}
                <div className="form-group mb-4 position-relative">
                  <Form.Control
                    className="form-control"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    autoComplete="confirm"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <span
                    className="position-absolute top-50 end-0 translate-middle-y me-3"
                    onClick={toggleConfirmPassword}
                    style={{ cursor: "pointer" }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
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
                      {loading ? "Changing..." : "Change Password"}
                    </Button>
                  </Col>
                </Row>
              </form>
              <p className="mb-2">
                Remember your password?{" "}
                <NavLink to={"/auth/signin-1"} className="f-w-400">
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

export default ChangePassword;
