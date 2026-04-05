const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User'); 

const uri = process.env.MONGODB_URI;

if (!uri || !uri.startsWith('mongodb')) {
    console.error("❌ ERROR: Your MONGODB_URI is missing or invalid in the .env file!");
    process.exit(1);
}

mongoose.connect(uri)
    .then(async () => {
        console.log("✅ Connected to MongoDB successfully!");
        const users = await User.find({});
        console.log("--- USERS FOUND ---");
        console.log(users); 
        console.log("-------------------");
        process.exit();
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
        process.exit(1);
    });