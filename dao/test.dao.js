import mysqlService from '../services/mysql.service.js';

class TestDao {
  async testConnection() {
    const result = await mysqlService.query('SELECT 1 + 1 AS result');
    return result[0].result === 2;
  }

  async initializeSchema() {
    await mysqlService.query(`
      CREATE TABLE IF NOT EXISTS gigs (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        venue VARCHAR(255) NOT NULL
      );
    `);

    await mysqlService.query(`
      CREATE TABLE IF NOT EXISTS bands (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        foundation_year INT NOT NULL
      );
    `);

    await mysqlService.query(`
      CREATE TABLE IF NOT EXISTS people (
        id VARCHAR(50) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        national_id VARCHAR(50) NOT NULL,
        age INT NULL
      );
    `);

    await mysqlService.query(`
      CREATE TABLE IF NOT EXISTS attendances (
        id VARCHAR(50) PRIMARY KEY,
        person_id VARCHAR(50) NOT NULL,
        gig_id VARCHAR(50) NOT NULL,
        FOREIGN KEY (person_id) REFERENCES people(id),
        FOREIGN KEY (gig_id) REFERENCES gigs(id)
      );
    `);

    await mysqlService.query(`
      CREATE TABLE IF NOT EXISTS gig_bands (
        gig_id VARCHAR(50) NOT NULL,
        band_id VARCHAR(50) NOT NULL,
        PRIMARY KEY (gig_id, band_id),
        FOREIGN KEY (gig_id) REFERENCES gigs(id),
        FOREIGN KEY (band_id) REFERENCES bands(id)
      );
    `);
  }
}

export default new TestDao();