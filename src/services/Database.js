const mysql = require('mysql2');

class Database {
    // This class is a wrapper for database connection. 
    // It centeralizes generic CRUD operations.

    #pool = null;
    #promisePool = null;

    constructor() {
        // Singleton - Design Pattern
        if (Database.instance instanceof Database) {
            return Database.instance;
        }
        const pool = mysql.createPool({
            host: process.env.RDS_HOST,
            user: process.env.RDS_USER,
            password: process.env.RDS_PASSWORD,
            port: process.env.RDS_PORT,
            waitForConnections: true,
        });
        
        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err);
            }
            if (connection) {
                connection.release();
                console.log('Database is connected 🪣'.cyan.bold);
            }
        });

        const promisePool = pool.promise();
        
        this.#pool = pool;
        this.#promisePool = promisePool;

        Object.freeze(this);
        Database.instance = this;
    }

    async query(sql) {
        const [rows, fields]  = await this.#promisePool.query(sql);
        return {
            rows,
            fields
        }
    }
}

module.exports = Database;