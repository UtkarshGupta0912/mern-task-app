const router = require('express').Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth'); // protect all routes below

// GET all tasks for logged-in user
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.json(tasks);
});

// POST create new task
router.post('/', auth, async (req, res) => {
  const task = new Task({ title: req.body.title, user: req.user.id });
  await task.save();
  res.json(task);
});

// PUT update task (toggle complete)
router.put('/:id', auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true } // return updated task
  );
  res.json(task);
});

// DELETE task
router.delete('/:id', auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Task deleted' });
});

module.exports = router;