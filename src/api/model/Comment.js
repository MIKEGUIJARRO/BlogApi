const Database = require('../../services/Database');
const Schema = require('./Schema');

class Comment extends Schema {
    #table = null;
    #columns = null
    constructor() {
        const table = 'Comment';
        const columns = {
            restricted: ['id', 'created_at', 'updated_at'],
            public: ['user', 'comment', 'blog_id']
        }
        super(table, columns);
        this.#columns = columns;
        this.#table = table;
    }
}

module.exports = new Comment();