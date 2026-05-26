const mysqlService = require('../services/mysql.service');

class EventBandDao {
  async saveAll(relations) {
    if (relations.length === 0) return;

    const values = relations.map(() => '(?, ?)').join(', ');
    const sql = `INSERT INTO event_bands (event_id, band_id) VALUES ${values}`;

    const params = relations.flatMap(relation => [
      relation.eventId,
      relation.bandId
    ]);

    await mysqlService.query(sql, params);
  }
}

module.exports = EventBandDao;
