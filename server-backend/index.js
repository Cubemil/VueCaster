const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { initializeDatabase } = require('./src/models/user');
const userRouter = require('./src/routes/user');

const app = express();

/************ APP SETUP ************/

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

/************ ROUTES ************/

app.use('/user', userRouter);

/************ SERVER INITIALIZATION ************/

const PORT = process.env.SERVER_PORT || 5050;

(async () => {
  try {
    await initializeDatabase(); // sync db
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize database or server:', error);
  }
})();
