const etlService = require('./services/etl.service');

async function main() {
  try {
    await etlService.run();
    process.exit(0);
  } catch (error) {
    console.error('ETL failed:', error.message);
    process.exit(1);
  }
}

main();
