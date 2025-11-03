const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

router.post('/api/attendance', async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!userId || !status) {
      return res.status(400).json({ error: 'Missing userId or status' });
    }

    const attendance = new Attendance({ userId, status });
    await attendance.save();

    res.status(201).json({ message: 'Attendance marked', attendance });
  } catch (err) {
    console.error('Error saving attendance:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/attendance/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const records = await Attendance.find({ userId });
    res.json(records);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
