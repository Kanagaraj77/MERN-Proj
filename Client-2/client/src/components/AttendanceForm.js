import React, { useState } from 'react';
import axios from 'axios';

function AttendanceForm({ userId, onMarked }) {
  const [status, setStatus] = useState('Present');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/attendance', { userId, status });
      alert('Attendance marked!');
      onMarked(); // refresh list
    } catch (err) {
      alert('Error marking attendance');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Status-deva:</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
      </select>
      <button type="submit">Mark Attendance Client-(2)</button>
    </form>
  );
}

export default AttendanceForm;
