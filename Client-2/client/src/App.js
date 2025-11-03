import React, { useState } from 'react';
import AttendanceForm from './components/AttendanceForm';
import AttendanceList from './components/AttendanceList';

function App() {
  const userId = '64f1a2c3e4b5a6d7e8f9a0b1'; // Replace with actual user ID
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshList = () => setRefreshKey(prev => prev + 1);

  return (
    <div>
      <h1>Attendance Tracker</h1>
      <AttendanceForm userId={userId} onMarked={refreshList} />
      <AttendanceList userId={userId} refreshTrigger={refreshKey} />
    </div>
  );
}

export default App;
