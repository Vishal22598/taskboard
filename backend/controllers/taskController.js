const Task = require('../models/Task');

// POST /api/tasks — create task
const createTask = async (req, res) => {
  const { title, description, columnId, boardId, priority, dueDate } = req.body;
  try {
    const count = await Task.countDocuments({ columnId });
    const task  = await Task.create({
      title, description, columnId, boardId,
      priority: priority || 'medium',
      dueDate:  dueDate  || null,
      order: count
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/tasks/:id — update task details or MOVE to another column
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title:       req.body.title,
        description: req.body.description,
        columnId:    req.body.columnId,   // ← changing this moves the task
        assignee:    req.body.assignee,
        priority:    req.body.priority,
        dueDate:     req.body.dueDate,
        order:       req.body.order
      },
      { new: true }
    ).populate('assignee', 'name email avatar');

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, updateTask, deleteTask };