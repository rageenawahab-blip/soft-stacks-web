​Sentinel Admin Dashboard (Node.js and Express. js) 

​A real-time administrative portal built using the MERN stack. This project features a secure authentication system and an instant notification system for managing student inquiries, designed with a focus on professional UI and real-time data flow.  
​🚀 Key Features
​Real-time Updates: Integrated Socket.io for bi-directional communication, allowing the dashboard to update instantly when new inquiries arrive without requiring a page refresh.  
​Secure Authentication: Implemented JWT (JSON Web Tokens) for protected admin routes, ensuring that sensitive lead data is only accessible to authorized users.  
​Advanced Backend Architecture: Built with Node.js and Express.js, featuring custom middleware for authentication and robust error handling.  
​Data Persistence: Utilizes MongoDB and Mongoose for scalable, document-based data storage and schema validation.  
​Responsive UI: A modern, minimalist dashboard interface with a professional navy-themed design, optimized for administrative efficiency.  
​🛠️ Tech Stack
​Frontend: Vanilla JavaScript (ES6+), HTML5, CSS3 (Custom Navy Theme).  
​Backend: Node.js, Express.js.  
​Database: MongoDB, Mongoose.  
​Real-time: Socket.io.  
​Security: JWT (JSON Web Tokens), Bcrypt.js for password hashing.  
​📂 Project Structure
​/models: Mongoose schemas for Students and Inquiries.  
​/routes: RESTful API endpoints for authentication and lead management.  
​/middleware: Custom JWT verification and security logic.  
​/public: Frontend assets and Vanilla JS dashboard logic.  
​server.js: Main entry point, server configuration, and Socket.io initialization.  
​⚙️ Installation & Setup
​Clone the repository:
git clone [https://github.com/rageenawahab-blip/soft-stacks-web.git](https://github.com/rageenawahab-blip/soft-stacks-web.git)  
​Install dependencies:
npm install  
​Environment Variables:
Create a .env file in the root directory and add:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key  
​Run the application:
npm start
