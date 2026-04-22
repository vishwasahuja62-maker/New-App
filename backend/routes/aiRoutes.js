const express = require('express');
const router = express.Router();
const { getMentorResponse, getCompanionResponse, solveDoubt } = require('../controllers/aiController');

router.get('/ping', (req, res) => res.json({ status: 'ok', message: 'AI Routes are active' }));
router.post('/mentor', getMentorResponse);
router.post('/companion', getCompanionResponse);
router.post('/doubt', solveDoubt);

module.exports = router;
