const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { initializeDatabase } = require('./src/models/user');
const routes = require('./src/routes/user');

const app = express();

/************ APP SETUP ************/

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/', routes);

/************ SERVER INITIALIZATION ************/

const PORT = process.env.SERVER_PORT || 5050;

(async () => {
  await initializeDatabase(); // sync db
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
