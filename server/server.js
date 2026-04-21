// 1. Import packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // loads .env file

const app = express();

// 2. Middleware — runs on every request
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mern-task-frontend-hck6.onrender.com' // your actual frontend URL
  ],
  credentials: true
}));            
app.use(express.json());      // lets us read JSON from request body

// 3. Routes — different URL paths
app.use('/api/auth', require('./routes/auth'));   // login/register
app.use('/api/tasks', require('./routes/tasks')); // task CRUD

// 4. Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected ✅');
    app.listen(process.env.PORT || 5000, () =>
      console.log('Server running on port 5000 ✅')
    );
  })
  .catch(err => console.log('DB Error:', err));