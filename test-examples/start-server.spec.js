const { test, expect } = require('@playwright/test');
const htttpServer = require('http-server');
const path = require('path');

// define path and port of local server
const PORT = 8000
const serverPath = path.join(__dirname, '../dist');
let server;

// start server before running tests
test.beforeAll(async () => {
  server = htttpServer.createServer({ root: serverPath });
  server.listen(PORT);
  console.log('Server started at http://localhost:${PORT}');
});

// stop server after running tests
test.afterAll(async () => {
  server.close();
  console.log('Server stopped');
});

// test the server is running
test('Server is running', async ({ page }) => {
  await page.goto('http://localhost:${PORT}');
  expect(await page.title()).toBe('My App');
});

// define url for the test
const baseURL = 'http://localhost:${PORT}/index.html';