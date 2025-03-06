import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';

const Friend = ({ data, onAttendanceMarked }) => {
  const getMealType = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 11) return 'breakfast';
    if (currentHour < 16) return 'lunch';
    if (currentHour < 19) return 'snacks';
    if (currentHour < 23) return 'dinner';
    return 'none';
  };

  // Check if the user has already marked attendance for the current meal
  const isAttendanceMarked = (elem) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const lastMeal = elem.meals?.[currentDate]?.at(-1);
    return lastMeal === getMealType();
  };

  // Mark attendance and refetch data
  const handleAttendanceSubmit = async (e, uniqueId) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `/api/markattendance/${uniqueId}`,
        { meals: getMealType() },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        onAttendanceMarked(); // Trigger data refetch in parent
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Server error occurred');
    }
  };
  return (
    <React.Fragment>
      {data.map((elem) => {
        const uniqueId = elem._id;
        const isChecked = isAttendanceMarked(elem);
        return (
          <Card className="userlist-box mb-0 shadow-none" style={{ flexDirection: 'row', backgroundColor: 'unset' }} key={uniqueId}>
            <Link to='#' className="media-left">
              <img
                className="media-object img-radius"
                style={{ height: '50px' }}
                src={elem.studentid.profilephoto}
                alt="Profile"
              />
              <div className="live-status">
                <Form>
                  <Form.Check
                    type="switch"
                    id={`custom-switch-${uniqueId}`}
                    checked={isChecked}
                    onChange={(e) => handleAttendanceSubmit(e, uniqueId)}
                    disabled={isChecked} // Disable if already marked
                  />
                </Form>
              </div>
            </Link>
            <Card.Body className="p-0">
              <h6 className="chat-header">
                <Link to={{pathname: `/app/Attendance/${elem.studentid._id}`,}}>{elem.studentid.fullname + ` - `}</Link>
                {elem.cardno}
                <br />
                {getMealType()}
              </h6>
            </Card.Body>
          </Card>
        );
      })}
    </React.Fragment>
  );
};

export default Friend;
