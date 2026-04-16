const Column = require('../models/Column');
const Task   = require('../models/Task');

// POST /api/columns — create column
const createColumn = async (req, res) => {
  const { title, boardId } = req.body;
  try {
    const count  = await Column.countDocuments({ boardId });
    const column = await Column.create({ title, boardId, order: count });
    res.status(201).json(column);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/columns/:id — rename or reorder column
const updateColumn = async (req, res) => {
  try {
    const column = await Column.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, order: req.body.order },
      { new: true }
    );
    if (!column) return res.status(404).json({ message: 'Column not found' });
    res.json(column);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/columns/:id — delete column and all tasks inside it
const deleteColumn = async (req, res) => {
  try {
    const column = await Column.findById(req.params.id);
    if (!column) return res.status(404).json({ message: 'Column not found' });

    await Task.deleteMany({ columnId: column._id });
    await column.deleteOne();
    res.json({ message: 'Column deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createColumn, updateColumn, deleteColumn };