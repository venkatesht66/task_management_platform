const Task = require('../models/Task');
const mongoose = require('mongoose');

const overview = async (req, res) => {
  try {
    const byStatus = await Task.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byPriority = await Task.aggregate([
      { $match: { deletedAt: null } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    res.json({ ok: true, data: { byStatus, byPriority } });
  } catch (err) {
    console.error('Overview error:', err);
    res.status(500).json({ ok: false, error: 'Overview failed' });
  }
};

const userPerformance = async (req, res) => {
  try {
    const userId = req.params.userId;

    const completed = await Task.countDocuments({
      assignedTo: new mongoose.Types.ObjectId(userId),
      status: 'done',
      deletedAt: null
    });

    const overdue = await Task.countDocuments({
      assignedTo: new mongoose.Types.ObjectId(userId),
      dueDate: { $lt: new Date() },
      status: { $ne: 'done' },
      deletedAt: null
    });

    res.json({
      ok: true,
      data: { tasksCompleted: completed, overdue }
    });
  } catch (err) {
    console.error('User performance error:', err);
    res.status(500).json({ ok: false, error: 'User perf failed' });
  }
};

const trends = async (req, res) => {
  try {
    const { from, to, granularity = 'day' } = req.query;
    const fromDate = from ? new Date(from) : new Date(Date.now() - 30*24*60*60*1000);
    const toDate = to ? new Date(to) : new Date();

    const groupFormat = {
      day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      week: { $dateToString: { format: "%Y-%U", date: "$createdAt" } },
      month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
    }[granularity];

    const rows = await Task.aggregate([
      { $match: { createdAt: { $gte: fromDate, $lte: toDate }, deletedAt: null } },
      { $group: { _id: groupFormat, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({ ok: true, data: rows });
  } catch (err) {
    console.error('Trends error:', err);
    res.status(500).json({ ok: false, error: 'Trends failed' });
  }
};

module.exports = { overview, userPerformance, trends };