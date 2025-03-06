import React, { useState, useEffect, useContext, createContext } from 'react';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
//import AddExpenses from './AddExpenses';
import { ToastContainer } from 'react-toastify';
import AllCollection from './AllCollection';
import PendingCollection from './PendingCollection';
import UpcomingCollection from './UpcomingCollection';
import axios from 'axios';

const DataContext = createContext();

const MainCollection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const collection = await axios.get('http://localhost:8009/api/collectionamnt', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const res = collection.data.result;
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
    <Row>
      <Col>
        <h5 className="mt-4">Collect Money 3x Faster</h5>
        <hr />
        <DataContext.Provider value={{ data, loading, error, addPost }}>
          <Tabs variant="pills" defaultActiveKey="all-collection" className="mb-3 tab-pill-center">
            <Tab eventKey="all-collection" title="COLLECT">
              <AllCollection onSuccess={fetchData} data={data} />
            </Tab>
            <Tab eventKey="pending-collection" title="PENDING">
              <PendingCollection onSuccess={fetchData} data={data} />
            </Tab>
            <Tab eventKey="upcoming-collection" title="UPCOMING">
              <UpcomingCollection onSuccess={fetchData} data={data} />
            </Tab>
          </Tabs>
        </DataContext.Provider>
        <ToastContainer />
      </Col>
    </Row>
  );
};
export const useData = () => useContext(DataContext);
export default MainCollection;
