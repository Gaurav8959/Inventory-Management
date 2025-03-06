import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import axios from 'axios';
import Friend from './Friends/Friend/index.jsx';

const ChatList = ({ listOpen, closed }) => {
  let listClass = ['header-user-list'];
  if (listOpen) {
    listClass = [...listClass, 'open'];
  }

  // Move state and fetching logic to ChatList
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to refetch data from the server
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/getcard');
      const cardsData = response.data.cards.filter(card => card.status === "Paid") || [];
      setData(cardsData);
    } catch (error) {
      console.log(error);
    }
  };
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, [data]);

  // Pass this function to Friend to trigger data refetch
  const refetchData = () => {
    fetchData();
  };

  const filteredData = data.filter((cardsData) => cardsData.studentid.fullname.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <React.Fragment>
      <div className={listClass.join(' ')}>
        <div className="h-list-header">
          <div className="input-group">
            <FormControl
              type="text"
              id="search-friends"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Name . . ."
            />
          </div>
        </div>
        <div className="h-list-body">
          <Link to="#" className="h-close-text" onClick={closed}>
            <i className="feather icon-chevrons-right" />
          </Link>
          <div className="main-friend-cont scroll-div">
            <div className="main-friend-list" style={{ height: 'calc(100vh - 85px)' }}>
              <PerfectScrollbar>
                {/* Pass data and switchStates as props */}
                <Friend data={filteredData} onAttendanceMarked={refetchData} />
              </PerfectScrollbar>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

ChatList.propTypes = {
  listOpen: PropTypes.bool,
  closed: PropTypes.func
};

export default ChatList;
