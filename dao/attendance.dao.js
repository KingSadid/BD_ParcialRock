const mysqlService = require('../services/mysql.service');

class AttendanceDao {
  async saveAll(attendances) {
    if (attendances.length === 0) return;

    const values = attendances.map(() => '(?, ?, ?)').join(', ');
    const sql = `INSERT INTO attendances (id, person_id, event_id) VALUES ${values}`;

    const params = attendances.flatMap(attendance => [
      attendance.id,
      attendance.personId,
      attendance.eventId
    ]);

    await mysqlService.query(sql, params);
  }
}

module.exports = AttendanceDao;
