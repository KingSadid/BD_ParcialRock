const pool = require('../env/mysqlConfig');

class MySqlService {
  async query(sql, params) {
    const connection = await pool.getConnection();
    try {
      const [results] = await connection.execute(sql, params);
      return results;
    } finally {
      connection.release();
    }
  }

  async transaction(operations) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const results = await operations(connection);
      await connection.commit();
      return results;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new MySqlService();
