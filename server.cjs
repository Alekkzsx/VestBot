const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3001; // Backend runs on different port than Angular
const DATA_FILE = path.join(__dirname, 'data', 'data-user.txt');

// Middleware
app.use(cors());
app.use(express.json());

// Estrutura padrão dos dados
const DEFAULT_USER_DATA = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  user: {
    stats: {
      questionsAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0,
      xp: 0,
      level: 1,
      essaysWritten: 0
    },
    questionHistory: [],
    schedule: []
  }
};

/**
 * Ensure data directory and file exist
 */
async function ensureDataFile() {
  try {
    // Check if data directory exists
    const dataDir = path.dirname(DATA_FILE);
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
      console.log('📁 Created data directory');
    }

    // Check if data file exists
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_USER_DATA, null, 2));
      console.log('📄 Created default data-user.txt file');
    }
  } catch (error) {
    console.error('Error ensuring data file:', error);
    throw error;
  }
}

/**
 * GET /api/user-data
 * Load user data from file
 */
app.get('/api/user-data', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const userData = JSON.parse(data);
    
    console.log('✅ User data loaded successfully');
    res.json(userData);
  } catch (error) {
    console.error('❌ Error loading user data:', error);
    
    // If file is corrupted, return default data
    if (error instanceof SyntaxError) {
      console.log('⚠️ Corrupted file, returning default data');
      res.json(DEFAULT_USER_DATA);
    } else {
      res.status(500).json({ 
        error: 'Failed to load user data',
        message: error.message 
      });
    }
  }
});

/**
 * POST /api/user-data
 * Save user data to file
 */
app.post('/api/user-data', async (req, res) => {
  try {
    const userData = req.body;
    
    // Validate data structure
    if (!userData.user || !userData.user.stats) {
      return res.status(400).json({ 
        error: 'Invalid data structure',
        message: 'Missing required fields: user.stats' 
      });
    }

    // Update timestamp
    userData.lastUpdated = new Date().toISOString();
    userData.version = '1.0.0';

    // Save to file
    await ensureDataFile();
    await fs.writeFile(DATA_FILE, JSON.stringify(userData, null, 2));
    
    console.log('💾 User data saved successfully');
    res.json({ 
      success: true, 
      message: 'Data saved successfully',
      lastUpdated: userData.lastUpdated
    });
  } catch (error) {
    console.error('❌ Error saving user data:', error);
    res.status(500).json({ 
      error: 'Failed to save user data',
      message: error.message 
    });
  }
});

/**
 * GET /api/user-data/backup
 * Download backup of user data
 */
app.get('/api/user-data/backup', async (req, res) => {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `vestbot-backup-${timestamp}.json`;
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(data);
    
    console.log('📦 Backup downloaded');
  } catch (error) {
    console.error('❌ Error creating backup:', error);
    res.status(500).json({ 
      error: 'Failed to create backup',
      message: error.message 
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'VestBot Backend is running',
    dataFile: DATA_FILE
  });
});

// Initialize server
async function startServer() {
  try {
    await ensureDataFile();
    
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 VestBot Backend Server Started!');
      console.log(`📡 Server running on: http://localhost:${PORT}`);
      console.log(`📄 Data file: ${DATA_FILE}`);
      console.log('');
      console.log('Available endpoints:');
      console.log(`  GET  /api/health            - Health check`);
      console.log(`  GET  /api/user-data         - Load user data`);
      console.log(`  POST /api/user-data         - Save user data`);
      console.log(`  GET  /api/user-data/backup  - Download backup`);
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
