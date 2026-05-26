const mysqlService = require('../services/mysql.service');

class BandDao {
  async saveAll(bands) {
    if (bands.length === 0) return;

    const values = bands.map(() => '(?, ?, ?)').join(', ');
    const sql = `INSERT INTO bands (id, name, founded_year) VALUES ${values}`;

    const params = bands.flatMap(band => [
      band.id,
      band.name,
      band.foundedYear
    ]);

    await mysqlService.query(sql, params);
  }
}

module.exports = BandDao;
