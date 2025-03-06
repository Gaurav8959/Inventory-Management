import React from 'react';
import axios from 'axios';
import '../combine.css';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteStaff = ({ show, stufftId,handleClose }) => {
  //Delete Student

  const Delete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`/api/deletestaff/${id}`, {
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
      console.error('Error deleting Staff:', error);
      toast.error(error || 'An error occurred');
    }
  };

//   const [del, setDel] = useState(show);
//   const [stdid, setStdId] = useState(studentId);
  const handledelClose = () => {
    handleClose();
  };

  const handlecnfrm = async () => {
    await Delete(stufftId);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handledelClose}>
        <Modal.Header closeButton className="theme-bg5">
          <Modal.Title style={{ color: 'white' }}>Delete Staff</Modal.Title>
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

export default DeleteStaff;
