const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();

// 1. MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. SERVE STATIC FILES (HTML, CSS, JS)
// This must stay near the top so the browser can find your files
app.use(express.static(path.join(__dirname, './')));

// 3. API ROUTES
const studentRoutes = require('./Routes/studentRoutes');
const teacherRoutes = require('./Routes/teacherRoutes');
const courseRoutes = require('./Routes/courseRoutes');
const inquiryRoutes = require('./Routes/inquiryRoutes');
const authRoutes = require('./Routes/authRoutes'); 

app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/auth', authRoutes);

// 4. HTML PAGE ROUTES (Clean URLs)
// 1. Tell Express to serve all your files (CSS, Images, JS) from the root folder
app.use(express.static(path.join(__dirname, './')));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Add routes for your other pages here so they don't 404
app.get('/dashboard', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dashboard.html'));
});

// In server.js, pass 'io' to your inquiry routes
app.use('/api/inquiries', (req, res, next) => {
    req.io = io; // Attach io to the request object
    next();
}, inquiryRoutes);

// 5. DATABASE CONNECTION
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ MongoDB Error:", err));

// 6. CREATE SERVER & SOCKET.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" } 
});

io.on('connection', (socket) => {
    console.log('User connected via Socket');
});

// 7. ENQUIRY TRIGGER (Modified to use 'io' correctly)
app.post('/api/enquiry', async (req, res) => {
    try {
        // ... (Your MongoDB save logic here) ...
        
        io.emit('new_student_lead', { 
            name: req.body.userName, 
            message: req.body.userMessage 
        });
        res.status(200).json({ message: "Inquiry saved and notification sent" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save inquiry" });
    }
});

// 8. START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Soft Stacks live on port ${PORT}`);
});