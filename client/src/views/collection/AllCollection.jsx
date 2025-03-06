import React, { useState, useEffect } from 'react';
import moment from 'moment';
import '../combine.css';
import { Col, Card, Table, Pagination, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SetDate from './SetDate';
import imgavtar from '../../assets/images/user/avatar-2.jpg';

const AllCollection = ({ data,onSuccess }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [setDateid, setSetDateid] = useState(null);
  const [amount, setAmount] = useState(null);
  const [type, setType] = useState(null);
  

  // Pagination logic
  const filteredData = data
  ? data
      .filter((pending) => pending.person_name?.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((pending) => !pending.collectionDate) // Exclude data where collectionDate exists
  : [];


  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData?.slice(startIndex, startIndex + itemsPerPage);

  const handleSetDate = (id) => {
    if (id) {
      setSetDateid(id);
      setShowUpdateModel(true);
    }
  };

  return (
    <>
      <SetDate
        show={showUpdateModel}
        handleUclose={() => {
          setShowUpdateModel(false);
        }}
        setDateid={setDateid}
        amount={amount}
        type={type}
        onSuccess={onSuccess}
      />

      <Col xs={12} md={12} lg={12} className="mb-4">
        <Card className="Recent-Users widget-focus-lg shadow-lg">
          <Card.Header className="d-flex justify-content-between mobile-flex-container align-items-center">
            <Card.Title as="h5">Collection Pending</Card.Title>
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
                          <h6 className="mb-1">{moment(pending.latest_transaction_date).format('YYYY-MM-DD')}</h6>
                        </td>
                        <td>
                          <h6 className="mb-1 text-danger">{pending.pending_amount}</h6>
                        </td>
                        <td>
                          <Link to="#" className="label theme-bg text-white f-12" onClick={() => handleSetDate(pending.CSId)}>
                            Set Date
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center" style={{ color: 'red' }}>
                        No Amount found for collection.
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

export default AllCollection;
