import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Breadcrumb from '../../../layouts/AdminLayout/Breadcrumb';

const Signin1 = () => {
  useEffect(() => {
    const Logouttoast = localStorage.getItem('LogoutToast');

    if (Logouttoast) {
      toast.success(Logouttoast, { position: 'top-center' });
      localStorage.removeItem('LogoutToast');
    }
  }, []);
  const [inpval, setInpval] = useState({
    email: '',
    userpassword: ''
  });

  const history = useNavigate();

  const setVal = (e) => {
    const { name, value } = e.target;
    setInpval(() => {
      return {
        ...inpval,
        [name]: value
      };
    });
  };
  const resetForm = () => {
    setInpval({
      email: '',
      userpassword: ''
    });
  };

  const loginuser = async (e) => {
    e.preventDefault();
    const { email, userpassword } = inpval;
    console.log(email, userpassword);
    if (email === '' || userpassword === '') {
      toast.error('All Fields are required!', { position: 'top-center' });
    } else if (!email.includes('@')) {
      toast.warning('includes @ in your email!', { position: 'top-center' });
    } else if (userpassword.length < 6) {
      toast.error('Password must be at least 6 characters', { position: 'top-center' });
    } else {
      try {
        const response = await fetch('http://localhost:8009/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: userpassword })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
          resetForm();
        }

        const res = await response.json();
        //console.log(res.result.userValid.name);

        if (res.success) {
          localStorage.setItem('userData', JSON.stringify(res.user.name));
          localStorage.setItem('token', res.token);
          localStorage.setItem('loginToast', 'Login Successful!');
          history('/app/dashboard');
          toast.success('login Successfully!', { position: 'top-center' });
          resetForm();
        } else {
          toast.error('Invalid login credentials!', { position: 'top-center' });
          resetForm();
        }
      } catch (error) {
        toast.error(error.message, { position: 'top-center' });
        resetForm();
      }
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
              <h3 className="mb-4">Sign In</h3>
              <form onSubmit={loginuser}>
                <div className="form-group mb-3">
                  <input
                    className="form-control"
                    label="Email Address / Username"
                    value={inpval.email}
                    name="email"
                    onChange={setVal}
                    placeholder="Enter your email..."
                    type="email"
                  />
                </div>
                <div className="form-group mb-4">
                  <input
                    className="form-control"
                    label="Password"
                    name="userpassword"
                    type="password"
                    autoComplete="password"
                    value={inpval.userpassword}
                    onChange={setVal}
                    placeholder="Password"
                  />
                </div>

                <div className="custom-control custom-checkbox  text-start mb-4 mt-2">
                  <input type="checkbox" className="custom-control-input mx-2" id="customCheck1" />
                  <label className="custom-control-label" htmlFor="customCheck1">
                    Save credentials.
                  </label>
                </div>

                <Row>
                  <Col mt={2}>
                    <Button className="btn-block mb-4" color="primary" size="large" type="submit" variant="primary">
                      Signin
                    </Button>
                  </Col>
                </Row>
              </form>
              <ToastContainer />
              <p className="mb-2 text-muted">
                Forgot password?{' '}
                <NavLink to={'/auth/email-for-reset'} className="f-w-400">
                  Reset
                </NavLink>
              </p>
              <p className="mb-0 text-muted">
                Don’t have an account?{' '}
                <NavLink to="/auth/signup" className="f-w-400">
                  Signup
                </NavLink>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
