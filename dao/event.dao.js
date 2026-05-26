const mysqlService = require('../services/mysql.service');

class EventDao {
  async saveAll(events) {
    if (events.length === 0) return;

    const values = events.map(() => '(?, ?, ?, ?)').join(', ');
    const sql = `INSERT INTO events (id, name, event_date, location) VALUES ${values}`;

    const params = events.flatMap(event => [
      event.id,
      event.name,
      event.eventDate,
      event.location
    ]);

    await mysqlService.query(sql, params);
  }
}

module.exports = EventDao;
