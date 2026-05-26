import pool from '../env/mysqlConfig.js';

class MysqlService {
  async query(sql, params) {
    const [results] = await pool.execute(sql, params);
    return results;
  }

  async getConnection() {
    return await pool.getConnection();
  }
}

export default new MysqlService();