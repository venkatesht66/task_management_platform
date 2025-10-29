const Task = require('../models/Task');
const xss = require('xss');
const mongoose = require('mongoose');

const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags = [], assignedTo = [] } = req.body;

    if (!title) return res.status(400).json({ ok: false, error: 'Title is required' });

    const task = new Task({
      title: xss(title),
      description: xss(description || ''),
      status: status || undefined,
      priority: priority || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags,
      assignedTo: assignedTo.map(id => new mongoose.Types.ObjectId(id)),
      createdBy: req.user?.id || null
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task: {
        id: task._id,
        title: task.title,
        status: task.status,
        priority: task.priority
      }
    });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ ok: false, error: 'Server error' });
  }
};

const listTasks = async (req, res) => {
  try {
    const { page = 1, limit = 20, q, status, priority, tag, assigned } = req.query;
    const filter = { deletedAt: null };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (q) filter.$or = [{ title: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }];
    if (tag) filter.tags = tag;
    if (assigned) filter.assignedTo = assigned;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const tasks = await Task.find(filter)
      .populate('createdBy', 'fullName email')
      .populate('assignedTo', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);
    res.json({ ok: true, data: tasks, meta: { total, page: parseInt(page), limit: parseInt(limit) } });
  } catch (err) {
    console.error('List tasks error:', err);
    res.status(500).json({ ok: false, error: 'List tasks failed' });
  }
};

const getTask = async (req, res) => {
  try {
    const t = await Task.findById(req.params.id).populate('createdBy', 'fullName email').populate('assignedTo', 'fullName email');
    if (!t || t.deletedAt) return res.status(404).json({ ok: false, error: 'Not found' });
    res.json({ ok: true, data: t });
  } catch (err) {
    console.error('Get task error:', err);
    res.status(500).json({ ok: false, error: 'Get task failed' });
  }
};

const updateTask = async (req, res) => {
  try {
    const id = req.params.id;
    const allowed = ['title','description','status','priority','dueDate','tags','assignedTo'];
    const updates = {};
    allowed.forEach(k => {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ ok: false, error: 'No fields to update' });
    }

    const task = await Task.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!task) {
      console.error(`Task not found: ID ${id}`);
      return res.status(404).json({ ok: false, error: 'Not found' });
    }

    res.json({ ok: true, data: task });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ ok: false, error: 'Update failed' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const t = await Task.findById(req.params.id);
    if (!t) return res.status(404).json({ ok: false, error: 'Not found' });
    t.deletedAt = new Date();
    await t.save();
    res.status(204).send();
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ ok: false, error: 'Delete failed' });
  }
};

const bulkCreate = async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!Array.isArray(tasks)) return res.status(400).json({ ok: false, error: 'tasks must be array' });
    const created = [];
    const errors = [];
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (!t.title) { errors.push({ index: i, reason: 'title required' }); continue; }
      const createdTask = await Task.create({ title: xss(t.title), description: xss(t.description || ''), createdBy: req.user?.id || null });
      created.push(createdTask);
    }
    res.status(201).json({ ok: true, created: created.length, errors });
  } catch (err) {
    console.error('Bulk create error:', err);
    res.status(500).json({ ok: false, error: 'Bulk create failed' });
  }
};

module.exports = { createTask, listTasks, getTask, updateTask, deleteTask, bulkCreate };