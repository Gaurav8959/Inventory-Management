import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Form, Button, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import AddCash from './AddCash';

const AddManageCash = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showAddModal, setShowAddModal] = useState(false);
  const [cashInHand, setCashInHand] = useState(0);
  const [todayBalance, setTodayBalance] = useState(0);

  const navigate = useNavigate();

  const handleAdd = () => {
    setShowAddModal(true);
  };

  const goToTransaction = () => {
    navigate("/app/date-wise-transaction");
  };

  // Compute total give/get amounts
  useEffect(() => {
    let total = 0;
    let todaysBalance = 0;

    data?.forEach((cash) => {
      const amount = Number(cash.amount) || 0; // Ensure amount is a number

      // Calculate total balance
      if (cash.transactionType === 'debit') {
        total -= amount;
      } else if (cash.transactionType === 'credit') {
        total += amount;
      }
      const todayDate = moment().format('YYYY-MM-DD');

      const formattedDate = moment.utc(cash.transactionDate).local().format('YYYY-MM-DD');
      // Compare in local time
      if (formattedDate === todayDate) {
        if (cash.transactionType === 'debit') {
          todaysBalance -= amount;
        } else if (cash.transactionType === 'credit') {
          todaysBalance += amount;
        }
      }
    });

    //console.log("Final Today's Balance:", todaysBalance); // Debugging
    // if (total < 0) {
    //   total = 0;
    // }

    setCashInHand(total);
    setTodayBalance(todaysBalance);
  }, [data]);

  // Pagination logic
  const todayDate = moment().format('YYYY-MM-DD');

  const filteredData =
    data?.filter(
      (cashbook) =>
        moment(cashbook.transactionDate).format('YYYY-MM-DD') === todayDate &&
        cashbook.amount?.toString().toLowerCase().includes(searchQuery.toLowerCase()) // Ensure amount is not undefined
    ) || [];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const today = moment().format('DD MMM');

  return (
    <>
      <AddCash show={showAddModal} handleClose={() => setShowAddModal(false)} bal={cashInHand} />
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 bg-light p-3">
          <Form.Control
            type="text"
            placeholder="Search by Amount..."
            value={searchQuery ?? ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar w-100 w-md-auto rounded-pill border-light shadow-sm"
          />
          <Button variant="primary" onClick={handleAdd} className="theme-bg3 rounded-pill shadow-sm px-4">
            <i className="fa fa-user-plus me-2" />
            Cash IN/OUT
          </Button>
        </Card.Header>
        <Card.Body>
          <Row className="text-center py-4 border-bottom">
            <Col xs={6} className="border-end">
              <h6 className="fw-bold text-muted">Cash in Hand</h6>
              <h4 className={cashInHand < 0 ? 'text-danger fw-bold': 'text-success fw-bold'}>$ {Math.abs(cashInHand)}</h4>
            </Col>
            <Col xs={6}>
              <h6 className="fw-bold text-muted">Today's Balance</h6>
              <h4 className={todayBalance < 0 ? 'text-danger fw-bold': 'text-success fw-bold'}>$ {Math.abs(todayBalance)}</h4>
            </Col>
          </Row>
          <h6 className='text-center mt-2 text-primary' onClick={() => goToTransaction()} style={{cursor: 'pointer'}}>VIEW SALES AND EXPENSE REPORT</h6>
          <Table responsive className="">
            <thead className="text-center bg-light">
              <tr>
                <th>{today}</th>
                <th>Out</th>
                <th>In</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedData.length > 0 ? (
                paginatedData.map((customer, index) => (
                  <tr key={customer.id || index} >
                    <td>{moment(customer.currentTime, 'HH:mm:ss').format('hh:mm A')}</td>
                    <td className={'text-danger fw-bold'}>{customer.transactionType === 'debit' ? customer.amount : ''}</td>
                    <td className={'text-success fw-bold'}>{customer.transactionType === 'credit' ? customer.amount : ''}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center" style={{ color: 'red' }}>
                    No Cards found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {/* Pagination code */}
          <Pagination className="justify-content-center">
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </Card.Body>
      </Card>
    </>
  );
};

export default AddManageCash;
