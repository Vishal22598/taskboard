const express = require('express');
const router  = express.Router();
const { getBoards, getBoardById, createBoard, updateBoard, deleteBoard }
  = require('../controllers/boardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',     protect, getBoards);
router.get('/:id',  protect, getBoardById);
router.post('/',    protect, createBoard);
router.put('/:id',  protect, updateBoard);
router.delete('/:id', protect, deleteBoard);

module.exports = router;