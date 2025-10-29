const Comment = require('../models/Comment');
const Task = require('../models/Task');
const xss = require('xss');

const addComment = async (req, res) => {
  try {
    const { body, parentId } = req.body;
    const taskId = req.params.taskId;
    if (!body) return res.status(400).json({ ok: false, error: 'body required' });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ ok: false, error: 'Task not found' });

    const c = await Comment.create({ taskId, authorId: req.user.id, body: xss(body), parentId: parentId || null });
    res.status(201).json({ ok: true, data: c });
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ ok: false, error: 'Comment failed' });
  }
};

const getComments = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const comments = await Comment.find({ taskId, deletedAt: null }).sort({ createdAt: 1 });
    res.json({ ok: true, data: comments });
  } catch (err) {
    console.error('Get comments error:', err);
    res.status(500).json({ ok: false, error: 'Get comments failed' });
  }
};

const updateComment = async (req, res) => {
  try {
    const id = req.params.id;
    const { body } = req.body;
    const c = await Comment.findById(id);
    if (!c) return res.status(404).json({ ok: false, error: 'Not found' });
    if (c.authorId && c.authorId.toString() !== req.user.id.toString() && req.user.role !== 'admin') return res.status(403).json({ ok: false, error: 'Forbidden' });
    c.body = xss(body || c.body);
    await c.save();
    res.json({ ok: true, data: c });
  } catch (err) {
    console.error('Update comment error:', err);
    res.status(500).json({ ok: false, error: 'Update comment failed' });
  }
};

const deleteComment = async (req, res) => {
  try {
    const id = req.params.id;
    const c = await Comment.findById(id);
    if (!c) return res.status(404).json({ ok: false, error: 'Not found' });
    if (c.authorId && c.authorId.toString() !== req.user.id.toString() && req.user.role !== 'admin') return res.status(403).json({ ok: false, error: 'Forbidden' });
    c.deletedAt = new Date();
    await c.save();
    res.status(204).send();
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ ok: false, error: 'Delete comment failed' });
  }
};

module.exports = { addComment, getComments, updateComment, deleteComment };