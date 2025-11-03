import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AttendanceList({ userId, refreshTrigger }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get(`/api/attendance/${userId}`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setRecords(res.data);
        } else {
          setRecords([]);
        }
      })
      .catch(() => alert('Error fetching attendance'));
  }, [userId, refreshTrigger]);

  return (
    <div>
      <h3>Attendance History</h3>
      <ul>
        {records.map(record => (
          <li key={record._id}>
            {new Date(record.date).toLocaleDateString()} - {record.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AttendanceList;
