import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const DateWiseTransaction = () => {
  const [thisMonth, setThisMonth] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8009/api/getdatewise', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const res = response.data.data || [];

      // Get start and end of the current month
      const startOfMonth = moment().startOf('month');
      const endOfMonth = moment().endOf('month');

      // Filter transactions within the current month
      const filteredData = res.filter(transaction => {
        const transactionDate = moment.utc(transaction.transactionDate).local();
        return transactionDate.isBetween(startOfMonth, endOfMonth, 'day', '[]'); // Inclusive
      });

      setThisMonth(filteredData);
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate();
  const gotodaily = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD')

    navigate(`/app/daily-transaction/${formattedDate}`);
    
  }

  useEffect(() => {
    fetchData();
  }, []);

  const today = moment().format('DD MMM yyyy');
  const startOfMonth = moment().startOf('month').format('DD MMM yyyy');

  return (
    <>
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 bg-light p-3"></Card.Header>
        <Card.Body>
          <Row className="text-center py-4 border-bottom">
            <Col xs={6} className="border-end">
              <h6 className="fw-bold text-primary ">{startOfMonth}</h6>
            </Col>
            <Col xs={6}>
              <h6 className="fw-bold text-primary">{today}</h6>
            </Col>
          </Row>
          <Table responsive>
            <thead className="text-center bg-light">
              <tr>
                <th>DATE</th>
                <th>Daily Balance</th>
                <th>Cash in Hand</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {thisMonth.length > 0 ? (
                thisMonth.map((transaction, index) => (
                  <tr key={transaction.id || index} onClick={()=>gotodaily(transaction.transactionDate)} style={{ cursor: 'pointer' }}>
                    <td>{moment(transaction.transactionDate).format('DD MMM yyyy')}</td>
                    <td className={transaction.daily_balance < 0 ? 'text-danger fw-bold': 'text-success fw-bold'}>{Math.abs(transaction.daily_balance)}</td>
                    <td className={transaction.cash_in_hand < 0 ? 'text-danger fw-bold': 'text-success fw-bold'}>{Math.abs(transaction.cash_in_hand)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center" style={{ color: 'red' }}>
                    No Data found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default DateWiseTransaction;
