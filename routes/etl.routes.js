const etlService = require('../services/etl.service');

class EtlRoutes {
  async handle(request, response) {
    const { url, method } = request;

    if (url === '/run-etl' && method === 'POST') {
      try {
        await etlService.run();
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ status: 'success', message: 'ETL completed' }));
      } catch (error) {
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ status: 'error', message: error.message }));
      }
      return;
    }

    if (url === '/' && method === 'GET') {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end('ETL Service Ready. POST to /run-etl to execute.');
      return;
    }

    response.writeHead(404);
    response.end('Not Found');
  }
}

module.exports = new EtlRoutes();
