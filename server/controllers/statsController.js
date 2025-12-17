const { User, Store, Rating } = require('../models');

// @desc    Get System Stats (Admin)
// @route   GET /api/stats/admin
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalStores = await Store.count();
        const totalRatings = await Rating.count();
        const activeUsers = await User.count({ where: { role: 'Normal User' } });

        res.json({
            totalRatings,
            totalUsers,
            totalStores,
            activeUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Store Stats (Owner)
// @route   GET /api/stats/store
// @access  Private (Owner)
const getStoreStats = async (req, res) => {
    try {
        const store = await Store.findOne({ where: { ownerId: req.user.id } });

        if (!store) {
            return res.json({
                hasStore: false,
                totalRatings: 0,
                averageRating: 0,
                ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                reviews: []
            });
        }

        const ratings = await Rating.findAll({
            where: { storeId: store.id },
            include: [{ model: User, attributes: ['name', 'email'] }],
            order: [['createdAt', 'DESC']]
        });

        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0
            ? ratings.reduce((acc, curr) => acc + curr.score, 0) / totalRatings
            : 0;

        // Calculate distribution
        const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach(r => {
            if (ratingCounts[r.score] !== undefined) {
                ratingCounts[r.score]++;
            }
        });

        res.json({
            hasStore: true,
            totalRatings,
            averageRating: parseFloat(averageRating.toFixed(1)),
            ratingCounts,
            reviews: ratings.map(r => ({
                id: r.id,
                user: r.User.name,
                score: r.score,
                date: r.createdAt
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get User Stats
// @route   GET /api/stats/user
// @access  Private (User)
const getUserStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const ratings = await Rating.findAll({ where: { userId } });
        const user = await User.findByPk(userId);

        const totalReviewsGiven = ratings.length;
        const averageRatingGiven = totalReviewsGiven > 0
            ? ratings.reduce((acc, curr) => acc + curr.score, 0) / totalReviewsGiven
            : 0;

        res.json({
            totalReviewsGiven,
            averageRatingGiven: parseFloat(averageRatingGiven.toFixed(1)),
            memberSince: user.createdAt
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAdminStats, getStoreStats, getUserStats };
