const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { initializeDatabase } = require('./src/models/initializeUserDb');
const userRouter = require('./src/routes/user');
const { logRequests } = require('./src/middlewares/logRequests');

/************ APP SETUP ************/

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logRequests);

/************ ROUTES ************/

app.use('/user', userRouter);

/************ SERVER INITIALIZATION ************/

const PORT = process.env.SERVER_PORT || 5050;

// https setup
const https = require('https');
const fs = require('fs');

const privateKey = fs.readFileSync('home/students/stempete/ssl/server.key', 'utf8');
const certificate = fs.readFileSync('home/students/stempete/ssl/server.crt', 'utf8');

// create https server
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app); // app is included here

// init db and setup server
(async () => {
  try {
    await initializeDatabase();
    
    // setup https server
    httpsServer.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database or server:', error);
  }
})();
