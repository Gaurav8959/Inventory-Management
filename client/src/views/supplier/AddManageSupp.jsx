import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Form, Button, Pagination, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AddSuppliers from './AddSupplier';
import { ToastContainer } from 'react-toastify';
import imgavtar from '../../assets/images/user/avatar-2.jpg';
import { FaSort, FaUserPlus, FaFilter } from 'react-icons/fa';

const AddManageSupp = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [filterType, setFilterType] = useState('all');
  const itemsPerPage = 5;
  const [showAddModal, setShowAddModal] = useState(false);
  const [ywgive, setYwgive] = useState(0);
  const [ywget, setYwget] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let totalGive = 0;
    let totalGet = 0;

    data?.forEach((supplier) => {
      if (supplier.final_balance >= 0) {
        totalGive += Math.abs(supplier.final_balance || 0);
      } else {
        totalGet += Math.abs(supplier.final_balance || 0);
      }
    });

    setYwgive(totalGive);
    setYwget(totalGet);
  }, [data]);

  const filteredData = (data || [])
    .filter((supplier) => supplier.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((supplier) => {
      if (filterType === 'debtors') return supplier.final_balance < 0;
      if (filterType === 'creditors') return supplier.final_balance > 0;
      return true;
    });

  filteredData.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'balance') return b.final_balance - a.final_balance;
    return 0;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <AddSuppliers show={showAddModal} handleClose={() => setShowAddModal(false)} />
      <Card className="shadow-sm border-0 rounded-3">
        <Card.Header className="d-flex justify-content-between align-items-center bg-light p-3">
          <Form.Control
            type="text"
            placeholder="Search suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-pill border-light shadow-sm w-50"
          />
          <div className="d-flex gap-2">
            <Dropdown onSelect={(e) => setSortBy(e)}>
              <Dropdown.Toggle variant="secondary" className="rounded-pill shadow-sm">
                <FaSort /> Sort
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="name">By Name</Dropdown.Item>
                <Dropdown.Item eventKey="balance">By Balance</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown onSelect={(e) => setFilterType(e)}>
              <Dropdown.Toggle variant="info" className="rounded-pill shadow-sm">
                <FaFilter /> Filter
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="all">All</Dropdown.Item>
                <Dropdown.Item eventKey="debtors">Debtors</Dropdown.Item>
                <Dropdown.Item eventKey="creditors">Creditors</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="primary" onClick={() => setShowAddModal(true)} className="rounded-pill shadow-sm">
              <FaUserPlus /> Add Supplier
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <Row className="text-center py-4 border-bottom">
            <Col xs={6} className="border-end">
              <h6 className="fw-bold text-muted">Total You'll Give</h6>
              <h4 className="text-success fw-bold">$ {Math.abs(ywgive) || 0}</h4>
            </Col>
            <Col xs={6}>
              <h6 className="fw-bold text-muted">Total Advance</h6>
              <h4 className="text-danger fw-bold">$ {Math.abs(ywget) || 0}</h4>
            </Col>
          </Row>
          <Table responsive className="mt-4">
            <thead className="text-center bg-light">
              <tr>
                <th>#</th>
                <th>Icon</th>
                <th>Supplier</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedData.length > 0 ? (
                paginatedData.map((supplier, index) => (
                  <tr key={supplier.id || index} onClick={() => navigate(`/app/supplier-transaction/${supplier.id}`, { state: { name: supplier.name } })} style={{ cursor: 'pointer' }}>
                    <td>{startIndex + index + 1}</td>
                    <td>
                      <img
                        src={supplier.profilePic || imgavtar}
                        alt={supplier.name}
                        className="rounded-circle me-2"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{supplier.name}</td>
                    <td className={supplier.final_balance > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                      $ {Math.abs(supplier.final_balance) || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-danger">No Suppliers Found</td>
                </tr>
              )}
            </tbody>
          </Table>
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
      <ToastContainer />
    </>
  );
};

export default AddManageSupp;
