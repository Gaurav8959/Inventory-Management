import React, { useState, useEffect } from "react";
import axios from "axios";
import "../combine.css";
import { Col, Card, Table, Pagination, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import DeleteStaff from "./DeleteStaff";
import UpdateStaff from "./UpdateStaff";

const AllInvoice = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffIdToDelete, setStaffIdToDelete] = useState(null);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [staffUid, setStaffUid] = useState(null);
  const [refresh, setRefresh] = useState(false); // Used for triggering re-fetch

  // Call fetchData only when the component mounts or refresh changes
  useEffect(() => {
    const fetchData = async() => {
      try {
        const staff = await axios.get("/api/getstaff");
        setData(staff.data.staffs || []);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [refresh]);

  // Trigger a refresh after delete/update
  const triggerRefresh = () => {
    setRefresh((prev) => !prev);
  };

  const filteredData = data.filter((staff) =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id) => {
    setStaffIdToDelete(id);
    setShowDeleteModal(true);
  };

  const handleUpdate = (stffUid) => {
    if (stffUid) {
      setStaffUid(stffUid);
      setShowUpdateModel(true);
    }
  };

  return (
    <>
      {/* Pass triggerRefresh to update/delete components */}
      <UpdateStaff
        show={showUpdateModel}
        handleUclose={() => {
          setShowUpdateModel(false);
          triggerRefresh(); // Fetch latest data after update
        }}
        staffUid={staffUid}
      />

      <DeleteStaff
        show={showDeleteModal}
        handleClose={() => {
          setShowDeleteModal(false);
          triggerRefresh(); // Fetch latest data after delete
        }}
        stufftId={staffIdToDelete}
      />

      <Col xs={12} md={12} lg={12} className="mb-4">
        <Card className="Recent-Users widget-focus-lg shadow-lg">
          <Card.Header className="d-flex justify-content-between mobile-flex-container align-items-center">
            <Card.Title as="h5">All Staff</Card.Title>
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
                    <th>Name</th>
                    <th>Contact Details</th>
                    <th>Designation</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((staff, index) => (
                      <tr key={staff._id || index} className="unread">
                        <td>{startIndex + index + 1}</td>
                        <td>
                          <h6 className="mb-1">{staff.name}</h6>
                        </td>
                        <td>
                          <h6 className="mb-1">{staff.email}</h6>
                          <h6 className="mb-1">{staff.mobile}</h6>
                          <h6 className="mb-1">{staff.address}</h6>
                        </td>
                        <td>
                          <h6 className="mb-1">{staff.desigination}</h6>
                        </td>
                        <td>
                          <Link
                            to="#"
                            className="label theme-bg text-white f-12"
                            onClick={() => handleUpdate(staff._id)}
                          >
                            Update
                          </Link>
                          <Link
                            to="#"
                            className="label theme-bg5 text-white f-12"
                            onClick={() => handleDelete(staff._id)}
                          >
                            Delete
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center" style={{ color: "red" }}>
                        No staff found.
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
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
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

export default AllInvoice;
