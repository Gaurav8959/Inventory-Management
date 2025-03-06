import React from 'react';
import { Row, Col, Tabs, Tab } from 'react-bootstrap';
import AllInvoice from './Allinvoice';
import AddInvoice from './AddInvoice';
import { ToastContainer } from 'react-toastify';

const Invoice = () => {
  return (
    <Row>
      <Col>
        <h5 className="mt-4">Add, Manage Invoice</h5>
        <hr />
        <Tabs variant="pills" defaultActiveKey="add-invoice" className="mb-3 tab-pill-center">
          <Tab eventKey="add-invoice" title="ADD-INVOICE">
            <AddInvoice />
          </Tab>
          <Tab eventKey="all-invoice" title="ALL-INVOICE">
            <AllInvoice />
          </Tab>
        </Tabs>
        <ToastContainer />
      </Col>
    </Row>
  );
};

export default Invoice;
