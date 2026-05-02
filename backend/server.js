const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));

// Serve Static Files in Production
const frontendPath = path.resolve(process.cwd(), 'frontend', 'dist');
console.log('Current Working Directory:', process.cwd());
console.log('Target Frontend Static Path:', frontendPath);

// Check if path exists
const fs = require('fs');
if (fs.existsSync(frontendPath)) {
  console.log('Frontend dist folder found. Contents:', fs.readdirSync(frontendPath));
} else {
  console.error('WARNING: Frontend dist folder NOT found at:', frontendPath);
}

app.use(express.static(frontendPath));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));

// For any other route, serve the index.html from frontend/dist
// For any other route, serve the index.html from frontend/dist
app.use((req, res) => {
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Frontend build not found. Please ensure the build script ran successfully.');
    }
  });
});

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
console.log('Attempting to connect to Database...');
connectDB()
  .then(() => {
    console.log('Database connected successfully.');
    app.listen(PORT, () => {
      console.log(`Server is live and running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('CRITICAL: Database connection failed during startup:', err);
    process.exit(1);
  });
