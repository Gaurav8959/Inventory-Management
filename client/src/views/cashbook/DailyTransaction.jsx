import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { useSearchParams, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import EditDailyTransaction from './EditDailyTransaction';
import { ToastContainer } from 'react-toastify';
import DeleteDailyTransaction from './DeleteDailyTransaction';

const DailyTransaction = () => {
  const [data, setData] = useState([]);
  const [SearchParams] = useSearchParams();
  const [todayIn, setTodayIn] = useState('');
  const [todayOut, setTodayOut] = useState('');
  const [showEditModel, setShowEditModel] = useState(false);
  const [showDelModel, setShowDelModel] = useState(false);
  const [editId, setEditId] = useState('');
  const [delId, setDelId] = useState('');

  const { transactionDate } = useParams();

  const handleTransactionSuccess = () => {
    setShowEditModel(false);
    setShowDelModel(false);
    fetchData(); // ✅ Ensure fetchData runs after delete
  };
  

  const handleEditModel = (id) => {
    if (id) {
      setEditId(id);
      setShowEditModel(true);
    }
  };
  const handleDelModel = (id) => {
    if (id) {
      setDelId(id);
      setShowDelModel(true);
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8009/api/getexpense?transactionDate=${transactionDate}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const res = response.data.data || [];
      setData(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [transactionDate]);

  useEffect(() => {
    let INamnt = 0;
    let OUTamnt = 0;

    data?.forEach((amnt) => {
      if (amnt.transactionType === 'debit') {
        OUTamnt += Math.abs(amnt.amount);
      } else {
        INamnt += Math.abs(amnt.amount);
      }
    });
    setTodayIn(INamnt);
    setTodayOut(OUTamnt);
  }, [data]);

  return (
    <>
      <EditDailyTransaction
        show={showEditModel}
        onSuccess={handleTransactionSuccess}
        editId={editId}
        handleClose={() => setShowEditModel(false)}
      />
      <DeleteDailyTransaction
        show={showDelModel}
        onSuccess={handleTransactionSuccess} // ✅ Call fetchData after delete
        delId={delId}
        handleClose={() => setShowDelModel(false)}
      />
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 bg-light p-3"></Card.Header>
        <Card.Body>
          <Row className="text-center py-4 border-bottom">
            <Col xs={6} className="border-end">
              <h6 className="fw-bold text-muted">Total Out</h6>
              <p className={'text-danger fw-bold'}>{Math.abs(todayOut)}</p>
            </Col>
            <Col xs={6}>
              <h6 className="fw-bold text-muted">Total In</h6>
              <p className={'text-success fw-bold'}>{Math.abs(todayIn)}</p>
            </Col>
          </Row>
          <Table responsive>
            <thead className="text-center bg-light">
              <tr>
                <th>DATE</th>
                <th>OUT</th>
                <th>IN</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {data.length > 0 ? (
                data.map((transaction, index) => (
                  <tr key={transaction.id || index}>
                    <td>{moment(transaction.currentTime, 'HH:mm:ss').format('hh:mm A')}</td>
                    <td className={'text-danger fw-bold'}>{transaction.transactionType === 'debit' ? transaction.amount : ''}</td>
                    <td className={'text-success fw-bold'}>{transaction.transactionType === 'credit' ? transaction.amount : ''}</td>
                    <td>
                      <i
                        className="fa fa-edit text-c-blue cursor-pointer"
                        onClick={() => handleEditModel(transaction.id)}
                        style={{ cursor: 'pointer' }}
                      />{' '}
                      /{' '}
                      <i className="fa fa-trash text-c-red" onClick={() => handleDelModel(transaction.id)} style={{ cursor: 'pointer' }} />
                    </td>
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
      <ToastContainer />
    </>
  );
};

export default DailyTransaction;
