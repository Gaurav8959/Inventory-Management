import React from 'react';
import axios from 'axios';
import '../combine.css';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteTransaction = ({ show, handleClose, onSuccess, transactionId }) => {
  //Delete Student

  const Delete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`/api/delete-transaction/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (res.data.success === true) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      // Handle 400 error when card exists
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        console.error('Error deleting student:', error);
        toast.error(error.message || 'An error occurred');
      }
    }
  };
  
//   const [del, setDel] = useState(show);
//   const [stdid, setStdId] = useState(studentId);
  const handledelClose = () => {
    handleClose();
  };

  const handlecnfrm = async () => {
    await Delete(transactionId);
    handleClose();
    onSuccess();
  };

  return (
    <>
      <Modal show={show} onHide={handledelClose}>
        <Modal.Header closeButton className="theme-bg5">
          <Modal.Title style={{ color: 'white' }}>Delete Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'red' }}>ARE YOU SURE TO DELETE</Modal.Body>
        <Modal.Footer>
        <Button variant="primary" className='theme-bg5' onClick={handlecnfrm}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handledelClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteTransaction;
