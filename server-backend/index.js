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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logRequests);

if(process.env.NODE_ENV === 'development') {
  app.use(cors());
} else {
  const corsOptions = {
    origin: 'https://webengineering.ins.hs-anhalt.de:10051',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
  app.use(cors(corsOptions));
}

/************ ROUTES ************/

app.use('/user', userRouter);

/************ SERVER INITIALIZATION ************/

const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.SERVER_PORT || 5050;

// init db and setup server
(async () => {
  try {
    await initializeDatabase();

    if (ENV === 'development') {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    } else {
      // https setup
      const https = require('https');
      const fs = require('fs');

      const privateKey = fs.readFileSync('/ssl/server.key', 'utf8');
      const certificate = fs.readFileSync('/ssl/server.crt', 'utf8');

      // create https server
      const credentials = { key: privateKey, cert: certificate };
      const httpsServer = https.createServer(credentials, app); // app is included here

      httpsServer.listen(PORT, () => {
        console.log(`Server running on https://webengineering.ins.hs-anhalt.de:10052`);
      });
    }
    
  } catch (error) {
    console.error('Failed to initialize database or server:', error);
  }
})();
