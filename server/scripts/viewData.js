const { sequelize, User, Store, Rating } = require('../models');

const viewData = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        const users = await User.findAll({ raw: true });
        console.log('\n=== USERS ===');
        console.table(users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));

        const stores = await Store.findAll({ raw: true });
        console.log('\n=== STORES ===');
        console.table(stores.map(s => ({ id: s.id, name: s.name, email: s.email, rating: s.rating })));

        const ratings = await Rating.findAll({ raw: true });
        console.log('\n=== RATINGS ===');
        console.table(ratings);

    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        await sequelize.close();
    }
};

viewData();
