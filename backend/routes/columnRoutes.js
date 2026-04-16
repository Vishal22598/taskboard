const express = require('express');
const router  = express.Router();
const { createColumn, updateColumn, deleteColumn }
  = require('../controllers/columnController');
const { protect } = require('../middleware/authMiddleware');

router.post('/',      protect, createColumn);
router.put('/:id',    protect, updateColumn);
router.delete('/:id', protect, deleteColumn);

module.exports = router;