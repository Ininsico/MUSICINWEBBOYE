const express = require('express');
const router = express.Router();
const { syncUser, getUserProfile } = require('../controllers/userController');
const { protectRoute } = require('../middleware/authMiddleware');

router.post('/sync', protectRoute, syncUser);

router.get('/profile', protectRoute, getUserProfile);

module.exports = router;
