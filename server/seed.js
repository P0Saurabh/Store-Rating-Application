const dotenv = require('dotenv');
dotenv.config();

const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        // await sequelize.sync({ force: true }); // WARNING: This clears DB

        const adminExists = await User.findOne({ where: { email: 'admin@roxiler.com' } });

        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin@123', salt);

            await User.create({
                name: 'System Administrator',
                email: 'admin@roxiler.com',
                password: hashedPassword,
                address: 'Admin HQ',
                role: 'System Administrator'
            });
            console.log('Admin user seeded.');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
        // Do not exit, allow other seeds to try or fail
    }
};

const seedStoreOwner = async () => {
    try {
        const { Store, Rating } = require('./models');

        const ownerEmail = 'owner@roxiler.com';
        let owner = await User.findOne({ where: { email: ownerEmail } });

        if (!owner) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Owner@123', salt);

            owner = await User.create({
                name: 'Store Owner',
                email: ownerEmail,
                password: hashedPassword,
                address: '123 Store St',
                role: 'Store Owner'
            });
            console.log('Store Owner seeded.');
        } else {
            console.log('Store Owner already exists.');
        }

        // Create a Store for this owner
        let store = await Store.findOne({ where: { ownerId: owner.id } });
        if (!store) {
            store = await Store.create({
                name: "Roxiler Flagship Store",
                email: "store@roxiler.com",
                address: "456 Commerce Blvd, Tech City",
                rating: 0,
                ownerId: owner.id
            });
            console.log('Store seeded.');
        } else {
            console.log('Store already exists.');
        }

        // Seed some ratings
        const ratingCount = await Rating.count({ where: { storeId: store.id } });
        if (ratingCount === 0) {
            // Need some users to rate
            const users = await User.findAll({ where: { role: 'Normal User' } });

            // If no normal users, create one temp
            let raterUser;
            if (users.length === 0) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash('User@123', salt);
                raterUser = await User.create({
                    name: 'Rater User',
                    email: 'rater@test.com',
                    password: hashedPassword,
                    role: 'Normal User'
                });
            } else {
                raterUser = users[0];
            }

            await Rating.create({ userId: raterUser.id, storeId: store.id, score: 5 });
            await Rating.create({ userId: raterUser.id, storeId: store.id, score: 4 });

            console.log('Ratings seeded.');
        } else {
            console.log('Ratings already exist.');
        }

    } catch (error) {
        console.error('Error seeding store owner:', error);
    }
};

const seedNormalUser = async () => {
    try {
        const userEmail = 'user@roxiler.com';
        let user = await User.findOne({ where: { email: userEmail } });

        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('User@123', salt);

            user = await User.create({
                name: 'Normal User',
                email: userEmail,
                password: hashedPassword,
                address: '789 User Ln',
                role: 'Normal User'
            });
            console.log('Normal User seeded.');
        } else {
            console.log('Normal User already exists.');
        }
    } catch (error) {
        console.error('Error seeding normal user:', error);
    }
    const seedAdditionalUsers = async () => {
        try {
            const salt = await bcrypt.genSalt(10);

            // New Owner
            const newOwnerEmail = 'newowner@roxiler.com';
            if (!await User.findOne({ where: { email: newOwnerEmail } })) {
                await User.create({
                    name: 'New Owner',
                    email: newOwnerEmail,
                    password: await bcrypt.hash('Newowner@123', salt),
                    role: 'Store Owner',
                    address: 'New Owner Address'
                });
                console.log('New Owner seeded.');
            }

            // Store Owner ID
            const storeOwnerIdEmail = 'storeownerid@roxiler.com';
            if (!await User.findOne({ where: { email: storeOwnerIdEmail } })) {
                await User.create({
                    name: 'Another Store Owner',
                    email: storeOwnerIdEmail,
                    password: await bcrypt.hash('StoreOwner@123', salt),
                    role: 'Store Owner',
                    address: 'Another Store Address'
                });
                console.log('Store Owner ID user seeded.');
            }

            // Normal User (User requested 'normaluser@roxiler.com')
            const normalUserEmail = 'normaluser@roxiler.com';
            if (!await User.findOne({ where: { email: normalUserEmail } })) {
                await User.create({
                    name: 'Demo Normal User',
                    email: normalUserEmail,
                    password: await bcrypt.hash('NormalUser@123', salt),
                    role: 'Normal User',
                    address: 'Demo User Address'
                });
                console.log('Demo Normal User seeded.');
            }

        } catch (error) {
            console.error('Error seeding additional users:', error);
        }
    };

    const runSeeds = async () => {
        await seedAdmin();
        await seedStoreOwner();
        await seedNormalUser();
        await seedAdditionalUsers(); // Add this
        process.exit();
    };

    runSeeds();
};
