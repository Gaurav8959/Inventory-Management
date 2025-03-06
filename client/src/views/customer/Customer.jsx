import React, { useContext, createContext, useState, useEffect } from 'react';
import '../combine.css';
import axios from 'axios';
import { Row, Col, Container } from 'react-bootstrap';
import AddManageCust from './AddManageCust';

const DataContext = createContext();

const Customer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const customer = await axios.get('http://localhost:8009/api/getcustomer', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const res = customer.data.data;
      setData(res || []);
      //console.log(res)
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error.message); // Fixed error variable name
      setLoading(false);
    }
  };

  // Add new customer
  const addPost = (newPost) => {
    setData((prevData) => [newPost, ...prevData]);
  };

  return (
    <DataContext.Provider value={{ data, loading, error, addPost }}>
      <Container fluid className="p-3">
        <Row className="justify-content-center">
          <Col md={12} lg={12}>
            <AddManageCust data={data} />
          </Col>
        </Row>
      </Container>
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
export default Customer;
