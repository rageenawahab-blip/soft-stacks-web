const mongoose = require('mongoose');
require('dotenv').config();

// 1. We define a temporary simple Schema just for this test
const TestSchema = new mongoose.Schema({
    testName: String,
    status: String,
    date: { type: Date, default: Date.now }
});

const TestEntry = mongoose.model('TestEntry', TestSchema);

async function runTest() {
    try {
        console.log("⏳ Connecting to Railway...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected!");

        // 2. Create the data
        const entry = new TestEntry({
            testName: "Soft Stacks Live Test",
            status: "Success - Railway is working!"
        });

        // 3. Save it
        await entry.save();
        console.log("🚀 DATA SAVED! Go look at your Railway Dashboard.");
        
        // 4. Close connection
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error during test:", err.message);
    }
}

runTest();