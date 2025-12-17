const { Store, Rating } = require('../models');

// @desc    Get all stores
// @route   GET /api/stores
// @access  Private (Admin only)
// @access  Private (Admin only)
const getStores = async (req, res) => {
    try {
        const stores = await Store.findAll({
            raw: true
        });

        const ratings = await Rating.findAll({
            raw: true
        });

        const storesWithRatings = stores.map(store => {
            const storeRatings = ratings.filter(r => r.storeId === store.id);
            const avgRating = storeRatings.length > 0
                ? storeRatings.reduce((acc, curr) => acc + curr.score, 0) / storeRatings.length
                : 0;

            return {
                ...store,
                rating: parseFloat(avgRating.toFixed(1))
            };
        });

        res.json(storesWithRatings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new store
// @route   POST /api/stores
// @access  Private (Store Owner)
const createStore = async (req, res) => {
    const { name, address, email } = req.body;

    try {
        const existingStore = await Store.findOne({ where: { ownerId: req.user.id } });

        if (existingStore) {
            return res.status(400).json({ message: 'You already have a store registered.' });
        }

        const store = await Store.create({
            name,
            address,
            email,
            ownerId: req.user.id,
            rating: 0
        });

        res.status(201).json(store);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStores, createStore };
