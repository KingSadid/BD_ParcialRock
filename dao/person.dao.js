const mysqlService = require('../services/mysql.service');

class PersonDao {
  async saveAll(people) {
    if (people.length === 0) return;

    const values = people.map(() => '(?, ?, ?, ?, ?)').join(', ');
    const sql = `INSERT INTO people (id, full_name, id_number, age, age_type) VALUES ${values}`;

    const params = people.flatMap(person => [
      person.id,
      person.fullName,
      person.idNumber,
      person.age,
      person.ageType
    ]);

    await mysqlService.query(sql, params);
  }
}

module.exports = PersonDao;
