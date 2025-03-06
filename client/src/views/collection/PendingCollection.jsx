import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../combine.css';
import { Col, Card, Table, Pagination, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SetDate from './SetDate';
import axios from 'axios';
import { toast } from 'react-toastify';
import imgavtar from '../../assets/images/user/avatar-2.jpg';

const PendingCollection = ({ data, onSuccess }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    onSuccess();
  }, []);
  const todayDate = moment().format('YYYY-MM-DD');
  const filteredData = data
    ? data
        .filter((pending) => pending.person_name?.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter((pending) => moment(pending.collectionDate).isSameOrBefore(todayDate)) // Only past dates
    : [];

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData?.slice(startIndex, startIndex + itemsPerPage);

  // Function to send an email
  const handleSendMail = async (email, amount) => {
    try {
      const response = await axios.post('http://localhost:8009/api/sendremaindermail', { email, amount });

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <>
      <Col xs={12} md={12} lg={12} className="mb-4">
        <Card className="Recent-Users widget-focus-lg shadow-lg">
          <Card.Header className="d-flex justify-content-between mobile-flex-container align-items-center">
            <Card.Title as="h5">Outdated Collection</Card.Title>
            <Form.Control
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar w-auto w-md-auto allstd"
            />
          </Card.Header>
          <Card.Body className="px-0 py-2">
            <div className="table-responsive">
              <Table responsive hover className="recent-users">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Icon</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData?.length > 0 ? (
                    paginatedData.map((pending, index) => (
                      <tr key={pending.id || index} className="unread">
                        <td>{startIndex + index + 1}</td>
                        <td>
                          <img
                            src={pending.profilePic || imgavtar} // Fallback image
                            alt={pending.person_name}
                            className="rounded-circle me-2"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        </td>
                        <td>
                          <h6 className="mb-1">{pending.person_name}</h6>
                        </td>
                        <td>
                          <h6 className="mb-1">{moment(pending.collectionDate).format('YYYY-MM-DD')}</h6>
                        </td>
                        <td>
                          <h6 className="mb-1 text-danger">{pending.pending_amount}</h6>
                        </td>
                        <td>
                          <Link
                            to="#"
                            className="label theme-bg text-white f-12"
                            onClick={() => handleSendMail(pending.email, pending.pending_amount)}
                          >
                            Send Remainder
                          </Link>

                          <Link
                            to={
                              pending.type === 'customer'
                                ? `/app/customer-transaction/${pending.CSId}`
                                : `/app/supplier-transaction/${pending.CSId}`
                            }
                            className="label theme-bg text-white f-12"
                          >
                            Pay
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center" style={{ color: 'red' }}>
                        No Pending Collection found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
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
      </Col>
    </>
  );
};

export default PendingCollection;
