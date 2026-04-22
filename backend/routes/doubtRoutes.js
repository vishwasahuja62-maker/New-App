const express = require('express');
const router = express.Router();
const { saveDoubt, getDoubts, deleteDoubt } = require('../controllers/doubtController');

router.post('/save', saveDoubt);
router.get('/user/:userId', getDoubts);
router.delete('/:id', deleteDoubt);

module.exports = router;
