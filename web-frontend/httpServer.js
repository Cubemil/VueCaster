const httpServer = require('http-server');
const path = require('path');

let server
const PORT = 8000;

const serverPath = path.dirname(__dirname) + '/dist';

export async function startup() {
  server = httpServer.createServer({ root: serverPath });
  server.listen(PORT);
  console.log(`Server running on http://localhost:${PORT}`);
}

export async function shutdown()  {
  if (!server) return;
  server.close();
  console.log('Server stopped');
}