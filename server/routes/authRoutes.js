const express = require('express');
const router = express.Router();
const { loginUser, registerUser, updatePassword, addUser } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.put('/password', protect, updatePassword);
router.post('/add-user', protect, admin, addUser); // Admin creating users

module.exports = router;
