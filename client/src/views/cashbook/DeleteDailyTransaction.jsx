import React from 'react';
import axios from 'axios';
import '../combine.css';
import { Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const DeleteDailyTransaction = ({ show, onSuccess, handleClose, delId }) => {

  const Delete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`http://localhost:8009/api/deleteexpense/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.success === true) {
        toast.success(res.data.message);
        onSuccess(); // ✅ Refresh cashbook after deletion
        handleClose();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        console.error('Error deleting transaction:', error);
        toast.error(error.message || 'An error occurred');
      }
    }
  };

  const handleConfirmDelete = async () => {
    await Delete(delId);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton className="theme-bg5">
        <Modal.Title style={{ color: 'white' }}>Delete Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: 'red' }}>ARE YOU SURE TO DELETE?</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" className="theme-bg5" onClick={handleConfirmDelete}>
          Yes
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteDailyTransaction;
