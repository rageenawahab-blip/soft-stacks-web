// seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust this path if your model is somewhere else

// 1. Connect to your database
const MONGODB_URI = "mongodb://mongo:ZXfwhYGXglngDaYvPiSVQOdCsDgHTPxi@gondola.proxy.rlwy.net:16971";

async function seedAdmin() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to Database");

        // 2. Check if admin already exists
        const existingAdmin = await User.findOne({ email: "rageenawahab@gmail.com" });
        if (existingAdmin) {
            console.log("⚠️ Admin already exists! No need to seed.");
            process.exit(0);
        }

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin1234", salt);

        // 4. Create the Admin User
        const adminUser = new User({
            email: "rageenawahab@gmail.com",
            password: hashedPassword
        });

        // 5. Save to Database
        await adminUser.save();
        console.log("🎉 Admin account created successfully!");

    } catch (error) {
        console.error("❌ Error seeding admin:", error);
    } finally {
        // 6. Disconnect and exit
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedAdmin();