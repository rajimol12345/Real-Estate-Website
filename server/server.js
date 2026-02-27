// Server restarted for chat fix verification
const express = require('express');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from the absolute path of the .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectDB = require('./config/db');
const propertyRoutes = require('./routes/properties');
const userRoutes = require('./routes/users');
const agentRoutes = require('./routes/agents');
const blogRoutes = require('./routes/blogs');
const messageRoutes = require('./routes/messages');
const leadRoutes = require('./routes/leads');
const botSettingsRoutes = require('./routes/botSettings');
const favoriteRoutes = require('./api/favorites');
const reviewRoutes = require('./api/reviews');
const authRoutes = require('./routes/authRoutes');
const notificationRoutes = require('./routes/notifications');
const savedSearchRoutes = require('./routes/savedSearches');
const chatRoutes = require('./routes/chat');
const appointmentRoutes = require('./routes/appointments');
const paymentRoutes = require('./routes/payments');
const communicationRoutes = require('./routes/communicationRoutes');
const adminLocationRoutes = require('./routes/adminLocationRoutes');

const multer = require('multer');
const cors = require('cors');

// Controllers/Middleware for direct routes
const { updateUserProfile } = require('./controllers/authController');
const { protect } = require('./middleware/auth');

connectDB();

const app = express();

console.log('**********************************************');
console.log('   SERVER RESTARTED AT: ' + new Date().toLocaleTimeString());
console.log('**********************************************');

app.use(cors()); // Use cors middleware
app.use(express.json({ limit: '10mb' })); // Increased limit for media payloads
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/api/debug-ping', (req, res) => res.json({ message: 'Server is alive', time: new Date() }));
app.get('/api/payments/ping', (req, res) => res.json({ message: 'Payments route is reached' }));

// GLOBAL LOGGER - HITS BEFORE EVERYTHING ELSE
app.use((req, res, next) => {
  console.log(`>>> [GLOBAL] ${req.method} ${req.originalUrl}`);
  next();
});

// MANUALLY REGISTER THE PROFILE ROUTE FOR ABSOLUTE CERTAINTY
app.put('/api/auth/profile', protect, (req, res, next) => {
  console.log('MATCHED: PUT /api/auth/profile');
  updateUserProfile(req, res, next);
});

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve static files
app.use('/property', express.static(path.join(__dirname, '..', 'property')));
app.use('/agents', express.static(path.join(__dirname, '..', 'agents')));
app.use('/blog', express.static(path.join(__dirname, '..', 'blog')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DIRECT ROUTES (priority)
app.get('/api/debug-version', (req, res) => res.json({ version: '1.0.5-debug', timestamp: new Date() }));
app.put('/api/auth/profile', protect, updateUserProfile);
app.use('/api/auth', authRoutes);

// Request Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
app.use('/api/chat', chatRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/bot-settings', botSettingsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/saved-searches', savedSearchRoutes);
app.use('/api', communicationRoutes);
app.use('/api/admin', adminLocationRoutes);


// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

app.get('/api/upload/test', (req, res) => {
  res.json({ message: 'Upload endpoint is active' });
});

app.post('/api/upload/single', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    url: `/uploads/${req.file.filename}`
  });
});

app.post('/api/upload', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }
  const filePaths = req.files.map(file => `/uploads/${file.filename}`);
  res.json(filePaths);
});

// Custom Error Handling Middleware
app.use((req, res, next) => {
  console.log(`404 HANDLER HIT for: ${req.method} ${req.originalUrl}`);
  // List all registered routes for debugging if 404 hit
  console.log('Available /api routes include /api/chat, /api/appointments, /api/leads etc.');
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  console.error(`ERROR: ${err.message}`);

  // Debug Logging to File
  const logEntry = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}\nError: ${err.message}\nStack: ${err.stack}\n\n`;
  fs.appendFileSync(path.join(__dirname, 'debug_error.log'), logEntry);

  if (err.name === 'ValidationError') {
    console.error('Validation Error Details:', err.errors);
    res.status(400);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    errors: err.errors // Send errors for better debugging in frontend
  });
});

const PORT = process.env.PORT || 5005;

console.log('Environment PORT:', process.env.PORT);
console.log('Starting server on port:', PORT);

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is busy, trying ${parseInt(PORT) + 1}...`);
    app.listen(parseInt(PORT) + 1, () => {
      console.log(`Server running on fallback port ${parseInt(PORT) + 1}`);
    });
  } else {
    console.error(err);
  }
});

