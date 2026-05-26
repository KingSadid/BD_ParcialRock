const http = require('http');
const etlRoutes = require('./routes/etl.routes');

const PORT = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
  etlRoutes.handle(request, response);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = server;
