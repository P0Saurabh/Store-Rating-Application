const { Rating, Store, sequelize } = require('../models');

// @desc    Submit or update a rating
// @route   POST /api/ratings
// @access  Private
const submitRating = async (req, res) => {
    const { storeId, score } = req.body;
    const userId = req.user.id;

    if (!storeId || !score || score < 1 || score > 5) {
        return res.status(400).json({ message: 'Invalid store or score (1-5)' });
    }

    try {
        const existingRating = await Rating.findOne({
            where: { userId, storeId }
        });

        if (existingRating) {
            existingRating.score = score;
            await existingRating.save();
        } else {
            await Rating.create({ userId, storeId, score });
        }

        res.json({ message: 'Rating submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get stores with user ratings and average ratings
// @route   GET /api/public/stores
// @access  Private
const getPublicStores = async (req, res) => {
    const userId = req.user.id;

    try {
        const stores = await Store.findAll({
            attributes: ['id', 'name', 'email', 'address'],
            raw: true
        });

        const ratings = await Rating.findAll({
            raw: true
        });

        const userRatings = ratings.filter(r => r.userId === userId);

        const storesWithData = stores.map(store => {
            const storeRatings = ratings.filter(r => r.storeId === store.id);
            const avgRating = storeRatings.length > 0
                ? storeRatings.reduce((acc, curr) => acc + curr.score, 0) / storeRatings.length
                : 0;

            const myRating = userRatings.find(r => r.storeId === store.id);

            return {
                ...store,
                rating: parseFloat(avgRating.toFixed(1)),
                myRating: myRating ? myRating.score : 0,
                ratingCount: storeRatings.length
            };
        });

        res.json(storesWithData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { submitRating, getPublicStores };
