const mysql = require('mysql2/promise');

let instance;

class Database {
  constructor() {
    if (!instance) {
      instance = this;
      this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        timezone: 'Z'
      });
    }
    return instance;
  }

  getConnection() {
    return this.pool;
  }
}

module.exports = new Database();
