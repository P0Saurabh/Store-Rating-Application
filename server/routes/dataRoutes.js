const express = require('express');
const router = express.Router();
const { getUsers, createUser } = require('../controllers/userController');
const { getAdminStats, getStoreStats, getUserStats } = require('../controllers/statsController');
const { getStores, createStore } = require('../controllers/storeController');
const { submitRating, getPublicStores } = require('../controllers/ratingController');
const { protect, admin } = require('../middleware/authMiddleware');

// User Routes
router.get('/users', protect, admin, getUsers);
router.post('/users', protect, admin, createUser);

// Store Routes
router.get('/stores', protect, admin, getStores);
router.post('/stores', protect, createStore);
router.get('/public/stores', protect, getPublicStores);

// Rating Routes
router.post('/ratings', protect, submitRating);

// Stats Routes
router.get('/stats/admin', protect, admin, getAdminStats);
router.get('/stats/store', protect, getStoreStats); // Add store owner middleware later if needed
router.get('/stats/user', protect, getUserStats);

module.exports = router;
