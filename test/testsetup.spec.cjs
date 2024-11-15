const { test, expect } = require('@playwright/test');
const httpServer = require('http-server');
const path = require('path');

const PORT = 8000;
const serverPath = path.join(__dirname, '../dist');
let server;

test.beforeAll(async () => {
    server = httpServer.createServer({ root: serverPath });
    server.listen(PORT);
    console.log(`Server running at http://localhost:${PORT}.index.html`);
});

test.afterAll(async () => {
    server.close();
    console.log('Server closed');
});

const baseURL = `http://localhost:${PORT}/index.html`;
