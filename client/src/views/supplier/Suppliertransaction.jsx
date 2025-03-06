import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../combine.css';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Card, Table, Button } from 'react-bootstrap';
import MakeTransaction from './Maketransaction.jsx';
import UpdateTransaction from './EditTransaction.jsx';
import DeleteTransaction from './DeleteTransaction';
import moment from 'moment';
const SupplierTransaction = () => {
  const [data, setData] = useState([]);
  const [showTransactionModal, setshowTransactionModal] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [transactionUid, setTransactionUid] = useState(null);
  const [transactionIdDelete, setTransactionIdDelete] = useState();
  const [sowDeleteModel, setShowDeleteModel] = useState();
  const handleTransactionSuccess = () => {
    fechData(); // Refresh transaction list after a successful transaction
    setshowTransactionModal(false);
    setShowUpdateModel(false);
  };
  const handleUpdate = (transUid) => {
    if (transUid) {
      setTransactionUid(transUid);
      setShowUpdateModel(true);
    }
  };
  const handleDelete = (id) => {
    if (id) {
      setTransactionIdDelete(id);
      setShowDeleteModel(true);
    }
  };
  const { id } = useParams();
  const fechData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:8009/api/getsuppliertransaction/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setData(Array.isArray(response.data.result) ? response.data.result : []);
    } catch (error) {
      console.log(error.message);
      setData([]); // Ensure data is an empty array if there's an error
    }
  };
  
  useEffect(() => {
    fechData();
  }, []);

  const location = useLocation();
  const name = location.state?.name;

  return (
    <Container fluid className="p-3">
      <MakeTransaction
        show={showTransactionModal}
        bal={data.length > 0 && data[0] ? data[0].final_balance : 0}
        handleClose={() => setshowTransactionModal(false)}
        onSuccess={handleTransactionSuccess}
      />
      <UpdateTransaction
        show={showUpdateModel}
        handleClose={() => setShowUpdateModel(false)}
        onSuccess={handleTransactionSuccess}
        transactionUid={transactionUid}
        data={data}
      />
      <DeleteTransaction
        show={sowDeleteModel}
        handleClose={() => setShowDeleteModel(false)}
        onSuccess={handleTransactionSuccess}
        transactionId={transactionIdDelete}
      />
      <Card>
        <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 bg-light p-3">
          <Card.Title as="h5">
            {name}
            <br />
            <span className="d-block m-t-5">
              {data.length > 0 && (
                <p>
                  {data.length > 0 && data[0] && parseFloat(data[0].final_balance) === 0 ? (
                    <h5 className="text-success">Settled up ☺</h5>
                  ) : parseFloat(data[0].final_balance) < 0 ? (
                    <span className="text-danger">Advance ${Math.abs(data[0].final_balance)}</span>
                  ) : (
                    <span className="text-success">You'll give ${data[0].final_balance}</span>
                  )}
                </p>
              )}
            </span>
          </Card.Title>
          <Button variant="primary" onClick={() => setshowTransactionModal(true)} className="theme-bg rounded-pill shadow-sm px-4">
            $ Make transaction
          </Button>
        </Card.Header>
        <Card.Body>
          <Table responsive hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Entries</th>
                <th>PAYMENT</th>
                <th>PURCHASE</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((transaction, index) => (
                  <tr key={transaction.id || index}>
                    <td>{index + 1}</td>
                    <td>{moment(transaction.currentDate).format('DD MMM YYYY, hh:mm A')}</td>
                    <td className={'text-danger fw-bold'}>{transaction.transactionType === 'debit' ? transaction.amount : ''}</td>
                    <td className={'text-success fw-bold'}>{transaction.transactionType === 'credit' ? transaction.amount : ''}</td>
                    <td>
                      <i
                        className="fa fa-edit text-c-blue cursor-pointer"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleUpdate(transaction.id)}
                      />{' '}
                      / <i className="fa fa-trash text-c-red" style={{ cursor: 'pointer' }} onClick={() => handleDelete(transaction.id)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center" style={{ color: 'red' }}>
                    No Transaction found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SupplierTransaction;
