const Schema = require('./Schema');
class Blog extends Schema {

    constructor() {
        const table = 'Blog';
        const columns = {
            restricted: ['id', 'created_at', 'updated_at'],
            public: ['active', 'title', 'thumbnail_url', 'body']
        }
        super(table, columns);
    }
}

module.exports = new Blog();