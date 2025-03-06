import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import axios from 'axios';
import '../combine.css';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Card, Table, Button } from 'react-bootstrap';
import MakeTransaction from './Maketransaction.jsx';
import UpdateTransaction from './EditTransaction.jsx';
import DeleteTransaction from './DeleteTransaction';
import moment from 'moment';
//import logo from '../../assets/images/user/avatar-2.jpg'

pdfMake.vfs = pdfFonts?.pdfMake?.vfs || pdfMake.vfs;

const CustomerTransaction = () => {
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
      const response = await axios.get(`http://localhost:8009/api/gettransaction/${id}`);
      setData(Array.isArray(response.data.result) ? response.data.result : []);
    } catch (error) {
      console.log(error.message);
      setData([]); // Ensure data is an empty array if there's an error
    }
  };

  useEffect(() => {
    fechData();
  }, [id]);

  const location = useLocation();
  const name = location.state?.name;

  const generatePDF = () => {
    if (!data || !Array.isArray(data)) return; // Prevents errors if data is undefined or not an array

    const docDefinition = {
      content: [
        {
          image: 'data:image/png;base64,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',
          width: 50,
          alignment: 'center',
          margin: [0, 0, 0, 10]
        },
        { text: 'Inventory Management', style: 'header' },
        { text: 'Customer Transaction Report', style: 'subheader' },
        { text: `Date: ${new Date().toLocaleDateString()}`, margin: [0, 0, 0, 10] },

        {
          table: {
            headerRows: 1,
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              [
                { text: 'Entries', style: 'tableHeader' },
                { text: 'Credit', style: 'tableHeader' },
                { text: 'Debit', style: 'tableHeader' },
                { text: 'Balance (£)', style: 'tableHeader' }
              ],
              ...data
                .filter((customer) => customer?.currentDate && customer?.final_balance !== undefined)
                .map((customer) => [
                  customer.currentDate ? moment(customer.currentDate).format('DD MMM YYYY, hh:mm A') : 'N/A',
                  customer.transactionType === 'credit' ? `£${customer.amount}` : '',
                  customer.transactionType === 'debit' ? `£${customer.amount}` : '',
                  customer.balance !== undefined ? `£${customer.balance}` : '£0.00'
                ])
            ]
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex % 2 === 0 ? '#F2F2F2' : null)
          }
        },

        {
          text: `Final Total: £${
            data.length > 0 && data[0]
              ? parseFloat(data[0].final_balance) === 0
                ? 'Settled up ☺'
                : parseFloat(data[0].final_balance) < 0
                  ? `Amount Due £${Math.abs(data[0].final_balance)}`
                  : `You will give £${data[0].final_balance}`
              : 'N/A'
          }`,
          style: 'total',
          margin: [0, 10, 0, 10]
        },

        { text: 'Thank you for your business!', style: 'footer', margin: [0, 20, 0, 0] },
        { text: 'For any queries, contact us at support@inventory.com', style: 'footer' }
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center' },
        subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 10] },
        tableHeader: { bold: true, fillColor: '#CCCCCC', color: 'black' },
        total: { fontSize: 12, bold: true, alignment: 'right' },
        footer: { fontSize: 10, alignment: 'center', color: 'grey' }
      }
    };

    pdfMake.createPdf(docDefinition).download('Customer_Report.pdf');
  };

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
                    <h5 className="text-primary">Settled up ☺</h5>
                  ) : parseFloat(data[0].final_balance) < 0 ? (
                    <span className="text-danger">You will get ${Math.abs(data[0].final_balance)}</span>
                  ) : (
                    <span className="text-success">You will give ${data[0].final_balance}</span>
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
                <th>You Gave</th>
                <th>You Got</th>
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
          <div className="d-flex justify-content-center">
            <Button variant="primary" onClick={generatePDF} className="theme-bg3 rounded-pill shadow-sm px-4">
              Generates Pdf
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CustomerTransaction;
