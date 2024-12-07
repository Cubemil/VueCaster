const httpServer = require('http-server');
const path = require('path');

const PORT = 8000;

test.beforeAll(async () => {
  const server = httpServer.createServer({
    root: path.join(__dirname, '..'),
  });
  server.listen(PORT);
});

test.afterAll(async () => {
  server.close();
});

const baseURL = `http://localhost:${PORT}/index.html`;