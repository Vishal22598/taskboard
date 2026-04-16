const Board  = require('../models/Board');
const Column = require('../models/Column');
const Task   = require('../models/Task');

// GET /api/boards — get all boards where user is owner or member
const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    }).populate('owner', 'name email');
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/boards/:id — get single board with columns and tasks
const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');

    if (!board) return res.status(404).json({ message: 'Board not found' });

    // Get columns and tasks for this board
    const columns = await Column.find({ boardId: board._id }).sort('order');
    const tasks   = await Task.find({ boardId: board._id })
      .populate('assignee', 'name email avatar')
      .sort('order');

    res.json({ board, columns, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/boards — create new board
const createBoard = async (req, res) => {
  const { title, background } = req.body;
  try {
    const board = await Board.create({
      title,
      owner: req.user._id,
      members: [req.user._id],
      background: background || '#0079BF'
    });

    // Auto-create 3 default columns
    const defaultColumns = ['To Do', 'In Progress', 'Done'];
    await Promise.all(
      defaultColumns.map((col, i) =>
        Column.create({ title: col, boardId: board._id, order: i })
      )
    );

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/boards/:id — update board title or background
const updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    // Only owner can update
    if (board.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    board.title      = req.body.title      || board.title;
    board.background = req.body.background || board.background;
    const updated = await board.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/boards/:id — delete board + all its columns and tasks
const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    if (board.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await Task.deleteMany({ boardId: board._id });
    await Column.deleteMany({ boardId: board._id });
    await board.deleteOne();

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBoards, getBoardById, createBoard, updateBoard, deleteBoard };