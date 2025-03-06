import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS
import axios from 'axios';

import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

const SignUp1 = () => {
  const [inpval, setInpval] = useState({
    name: '',
    email: '',
    mobile: '',
    businessName: '',
    userpassword: ''
  });

  const navigate = useNavigate();

  const handleOnchange = (e) => {
    setInpval({
      ...inpval,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setInpval({
      name: '',
      email: '',
      mobile: '',
      businessName: '',
      userpassword: ''
    });
  };

  const register = async (e) => {
    e.preventDefault();
    const { name, email, mobile, businessName, userpassword } = inpval;
    
    if (!name || !email || !mobile || !businessName || !userpassword) {
      toast.error('All fields are required!', { position: 'top-center' });
      return;
    }

    if (!email.includes('@')) {
      toast.warning('Please include @ in your email!', { position: 'top-center' });
      return;
    }

    if (userpassword.length < 6) {
      toast.error('Password must be at least 6 characters', { position: 'top-center' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8009/api/register', inpval);
      
      if (response.data.success) {
        toast.success('Registration successful! Verify your OTP sended to your Email.', { position: 'top-center' });

        localStorage.setItem("userEmail", email);
        
        // Delay redirection to let the user see the success message
        setTimeout(() => {
          navigate('/auth/otp-verify');
          resetForm();
        }, 3000);
      } else {
        toast.error(response.data.message || 'Something went wrong', { position: 'top-center' });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage, { position: 'top-center' });
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
          <Card className="borderless">
            <Row className="align-items-center">
              <Col>
                <Card.Body className="text-center">
                  <div className="mb-4">
                    <i className="feather icon-user-plus auth-icon" />
                  </div>
                  <h3 className="mb-4">Register</h3>
                  <form onSubmit={register}>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        name="name"
                        onChange={handleOnchange}
                        value={inpval.name}
                        autoComplete='name'
                        className="form-control"
                        placeholder="Username"
                      />
                    </div>
                    <div className="input-group mb-3">
                      <input
                        type="email"
                        name="email"
                        onChange={handleOnchange}
                        value={inpval.email}
                        autoComplete='email'
                        className="form-control"
                        placeholder="Email address"
                      />
                    </div>
                    <div className="input-group mb-3">
                      <input
                        type="number"
                        name="mobile"
                        onChange={handleOnchange}
                        value={inpval.mobile}
                        autoComplete='mobile'
                        className="form-control"
                        placeholder="Enter Mobile"
                      />
                    </div>
                    <div className="input-group mb-4">
                      <input
                        type="text"
                        name="businessName"
                        onChange={handleOnchange}
                        autoComplete='businessName'
                        value={inpval.businessName}
                        className="form-control"
                        placeholder="Business Name"
                      />
                    </div>
                    <div className="input-group mb-4">
                      <input
                        type="password"
                        name="userpassword"
                        onChange={handleOnchange}
                        value={inpval.userpassword}
                        autoComplete='userpassword'
                        className="form-control"
                        placeholder="Password"
                      />
                    </div>
                    <button type="submit" className="btn btn-primary mb-4">
                      Sign up
                    </button>
                  </form>
                  <p className="mb-2">
                    Already have an account?{' '}
                    <NavLink to={'/auth/signin-1'} className="f-w-400">
                      Login
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
      <ToastContainer autoClose={3000} hideProgressBar />
    </React.Fragment>
  );
};

export default SignUp1;
