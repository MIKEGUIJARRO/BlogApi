const Database = require('../../services/Database');
const { isObject } = require('../../util/helpers');
const ErrorResponse = require('../../util/ErrorResponse');

// Parent class that abstracts the CRUD
// operations in our models
class Schema {
    #table = null;
    #columns = null;

    constructor(table, columns) {
        this.#table = table;
        this.#columns = {
            restricted: [...columns.restricted],
            public: [...columns.public]
        };
    }

    async find(startRow, limit) {
        const offset = startRow - 1;
        const db = new Database();
        const query = `SELECT * FROM ${this.#table} LIMIT ${limit} OFFSET ${offset}`;
        const response = await db.query(query);
        return response;
    }

    async findWhere(startRow, limit, conditions) {

        if (!isObject(conditions)) {
            throw new ErrorResponse('Server Error. The findByIdWhere method received an argument that is not an object.', 500);
        }
        const values = [];
        const columns = [];
        for (let key in conditions) {
            columns.push(key);
            values.push(conditions[key]);
        }
        columns.forEach((item, index) => {
            columns[index] = item + ' = ?';
        });

        const offset = startRow - 1;
        const db = new Database();
        const query = `SELECT * FROM ${this.#table} WHERE ${columns.join(' AND ')} LIMIT ${limit} OFFSET ${offset}`;
        const response = await db.query(query, values);
        return response;
    }

    async findById(id) {
        const db = new Database();
        const query = `SELECT * FROM ${this.#table} WHERE id = ${id}`;
        const response = await db.query(query);
        if (response.rows.length === 0) {
            throw new ErrorResponse('Bad Request. The id does not exist.', 400);
        }
        return response;
    }

    async findByIdWhere(id, conditions) {
        if (!isObject(conditions)) {
            throw new ErrorResponse('Server Error. The findByIdWhere method received an argument that is not an object.', 500);
        }
        const values = [];
        const columns = [];
        for (let key in conditions) {
            columns.push(key);
            values.push(conditions[key]);
        }
        columns.forEach((item, index) => {
            columns[index] = item + ' = ?';
        });
        const db = new Database();
        const query = `SELECT * FROM ${this.#table} WHERE id = ${id} AND ${columns.join(' AND ')}`;

        const response = await db.query(query, values);
        if (response.rows.length === 0) {
            throw new ErrorResponse('Bad Request. The findByIdWhere received invalid params.', 400);
        }
        return response;
    }

    async create(body) {
        if (!isObject(body)) {
            throw new ErrorResponse('Bad Request. The create method received an argument that is not an object.', 400);
        }

        if (Object.keys(body).length > this.#columns.public.length) {
            throw new ErrorResponse('Bad Request. The create method received an object with extra properties.', 400);
        }

        const columns = [];
        const values = [];

        let columnHelper = this.#columns.public;

        for (let key in body) {
            columns.push(key);
            values.push(body[key]);

            // Ensures that the keys in the object
            // matches the public columns.
            columnHelper = columnHelper.filter((item) => item !== key);
        }

        if (columnHelper.length > 0) {
            throw new ErrorResponse('Bad Request. Incorrect amount of values. Provide all the properties to POST.', 400);
        }

        const placeHolders = values.map(() => '?');

        const db = new Database();
        const query = `INSERT INTO ${this.#table} (${columns.join(', ')}) VALUES (${placeHolders.join(', ')})`;
        const { rows, fields } = await db.query(query, values);

        const id = rows.insertId;
        const response = await this.findById(id);
        return response;
    }

    async findByIdAndUpdate(id, body) {
        if (!isObject(body)) {
            throw new ErrorResponse('Bad Request. The create method received an argument that is not an object', 400);
        }

        const columns = [];
        const values = [];

        // Checks for invalid values in body
        for (let key in body) {
            const isIncluded = this.#columns.public.includes(key);
            if (!isIncluded) {
                throw new ErrorResponse('Bad Request. The body contains one or more invalid properties.', 400);
            };

            columns.push(key);
            values.push(body[key]);
        }
        columns.forEach((item, index) => {
            columns[index] = item + ' = ?';
        });
        const db = new Database();
        const query = `UPDATE ${this.#table} SET ${columns.join(', ')} WHERE id = ${id}`;
        await db.query(query, values);

        const response = await this.findById(id);
        return response;
    }

    async findByIdAndUpdateWhere(id, body, conditions) {

        if (!isObject(body)) {
            throw new ErrorResponse('Bad Request. The create method received an argument that is not an object', 400);
        }

        const columnsBody = [];
        const valuesBody = [];

        // Checks for invalid values in body
        for (let key in body) {
            const isIncluded = this.#columns.public.includes(key);
            if (!isIncluded) {
                throw new ErrorResponse('Bad Request. The body contains one or more invalid properties.', 400);
            };

            columnsBody.push(key);
            valuesBody.push(body[key]);
        }

        columnsBody.forEach((item, index) => {
            columnsBody[index] = item + ' = ?';
        });

        const columnsCondition = [];
        const valuesCondition = [];
        for (let key in conditions) {
            columnsCondition.push(key);
            valuesCondition.push(conditions[key]);
        }

        columnsCondition.forEach((item, index) => {
            columnsCondition[index] = item + ' = ?';
        });

        const db = new Database();
        const query = `UPDATE ${this.#table} SET ${columnsBody.join(', ')} WHERE id = ${id} AND ${columnsCondition.join(' AND ')}`;
        await db.query(query, [...valuesBody, ...valuesCondition]);
        const response = await this.findByIdWhere(id, conditions);
        return response;

    }

    async findByIdAndDelete(id) {
        const response = await this.findById(id);

        const db = new Database();
        const deleteQuery = `DELETE FROM ${this.#table} WHERE id = ${id}`;
        await db.query(deleteQuery);
        return response;
    }

    async findByIdAndDeleteWhere(id, conditions) {
        if (!isObject(conditions)) {
            throw new ErrorResponse('Server Error. The findByIdWhere method received an argument that is not an object.', 500);
        }
        const values = [];
        const columns = [];
        for (let key in conditions) {
            columns.push(key);
            values.push(conditions[key]);
        }
        columns.forEach((item, index) => {
            columns[index] = item + ' = ?';
        });

        const response = await this.findByIdWhere(id, conditions);

        const db = new Database();
        const deleteQuery = `DELETE FROM ${this.#table} WHERE id = ${id} AND ${columns.join(', ')}`;
        await db.query(deleteQuery, values);
        return response;
    }

    async countRows() {
        const db = new Database();
        const query = `SELECT COUNT(id) AS total FROM ${this.#table}`;
        const response = await db.query(query);
        return response.rows[0].total;
    }

    async countRowsWhere(conditions) {

        if (!isObject(conditions)) {
            throw new ErrorResponse('Server Error. The findByIdWhere method received an argument that is not an object.', 500);
        }
        const values = [];
        const columns = [];
        for (let key in conditions) {
            columns.push(key);
            values.push(conditions[key]);
        }
        columns.forEach((item, index) => {
            columns[index] = item + ' = ?';
        });

        const db = new Database();
        const query = `SELECT COUNT(id) AS total FROM ${this.#table} WHERE ${columns.join(', ')}`;
        const response = await db.query(query, values);
        return response.rows[0].total;
    }

    async query(query) {
        if (typeof query != 'string') {
            throw new ErrorResponse('Server Error. The query is invalid', 500)
        }
        const db = new Database();
        const response = await db.query(query);
        return response;
    }
}

module.exports = Schema;