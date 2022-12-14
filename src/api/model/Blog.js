const Schema = require('./Schema');
class Blog extends Schema {
    #table = null;
    #columns = null
    constructor() {
        const table = 'Blog';
        const columns = {
            restricted: ['id', 'created_at', 'updated_at'],
            public: ['active', 'title', 'thumbnail_url', 'body']
        }
        super(table, columns);
        this.#columns = columns;
        this.#table = table;
    }
}

module.exports = new Blog();