import React, { useContext, createContext, useState, useEffect } from 'react';
import '../combine.css';
import axios from 'axios';
import { Row, Col, Container } from 'react-bootstrap';
import AddManageCash from './AddManageCash';
import EditDailyTransaction from './EditDailyTransaction';
import DeleteDailyTransaction from './DeleteDailyTransaction'; // Import Delete Component

const DataContext = createContext();

const Cashbook = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [delId, setDelId] = useState(null); // Track deleting transaction
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Control delete modal

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8009/api/getexpense', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Function to open the edit modal
  const handleEdit = (id) => {
    setEditId(id);
    setShowEditModal(true);
  };

  // Function to open the delete modal
  const handleDelete = (id) => {
    setDelId(id);
    setShowDeleteModal(true);
  };

  return (
    <DataContext.Provider value={{ data, loading, error, fetchData }}>
      <Container fluid className="p-3">
        <Row className="justify-content-center">
          <Col md={12} lg={12}>
            <AddManageCash data={data} onEdit={handleEdit} onDelete={handleDelete} />
          </Col>
        </Row>
      </Container>

      {/* Edit Modal */}
      {editId && (
        <EditDailyTransaction
          show={showEditModal}
          editId={editId}
          onSuccess={fetchData} // Refresh data after edit
          handleClose={() => setShowEditModal(false)}
        />
      )}

      {/* Delete Modal */}
      {delId && (
        <DeleteDailyTransaction
          show={showDeleteModal}
          delId={delId}
          onSuccess={fetchData} // Refresh data after delete
          handleClose={() => setShowDeleteModal(false)}
        />
      )}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
export default Cashbook;
