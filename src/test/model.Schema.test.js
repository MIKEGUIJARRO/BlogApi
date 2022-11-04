
const mockQuery = jest.fn().mockResolvedValue({ rows: ['data'], fields: ['data'] });
jest.mock('../services/Database.js', () => {
    return jest.fn().mockImplementation(() => {
        return {
            query: mockQuery,
        }
    })
});

const Schema = require('../api/model/Schema');
const Database = require('../services/Database');

describe('Schema Model Unit Test', () => {

    let schema = null;
    beforeEach(() => {
        const table = 'table';
        const columns = {
            restricted: ['id'],
            public: ['title'],
        }
        schema = new Schema(table, columns);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });


    describe('find() functionality', () => {
        it('should send a successful response', async () => {
            const startRow = 1;
            const limit = 2;
            const db = new Database();

            const response = await schema.find(startRow, limit);

            expect(response).toEqual({ rows: ['data'], fields: ['data'] });
            expect(db.query).toBeCalled();
        });

        it('should throw an error if the query is incorrect', async () => {
            const startRow = 1;
            const limit = 2;
            const db = new Database();

            db.query.mockImplementationOnce(() => {
                throw new Error()
            });
            const fn = async () => {
                const response = await schema.find(startRow, limit);
            }
            expect(fn()).rejects.toThrow()
        });
    });
    describe('findWhere() functionality', () => {
        it('should send a successful response', async () => {
            const startRow = 1;
            const limit = 2;
            const db = new Database();
            const conditions = {
                blog_id: 1
            }
            const response = await schema.findWhere(startRow, limit, conditions);

            expect(response).toEqual({ rows: ['data'], fields: ['data'] });
            expect(db.query).toBeCalled();
        });

        it('should throw an error if the query is incorrect', async () => {
            const startRow = 1;
            const limit = 2;
            const conditions = {
                blog_id: 1
            }
            const db = new Database();

            db.query.mockImplementationOnce(() => {
                throw new Error()
            });
            const fn = async () => {
                const response = await schema.findWhere(startRow, limit, conditions);
            }
            expect(fn()).rejects.toThrow()
        });
    })
    describe('findById() functionality', () => {
        it('should find a user successfully', async () => {
            const id = 1;
            const response = await schema.findById(id);
            expect(response).toEqual({ rows: ['data'], fields: ['data'] });
            expect(response.rows.length).toBe(1);
        });

        it('should throw if the user does not exists', async () => {
            const id = 100;
            const db = new Database();

            db.query.mockImplementationOnce(() => {
                return { rows: [], fields: [] }
            });

            const fn = async () => {
                const response = await schema.findById(id);
            }
            expect(fn()).rejects.toThrow();
        });
    });

    describe('findByIdWhere() functionality', () => {
        it('should find a user successfully', async () => {
            const id = 1;
            const conditions = {
                blog_id: 1
            }
            const response = await schema.findByIdWhere(id, conditions);
            expect(response).toEqual({ rows: ['data'], fields: ['data'] });
            expect(response.rows.length).toBe(1);
        });

        it('should throw if the user does not exists', async () => {
            const id = 100;
            const db = new Database();
            const conditions = {
                blog_id: 1
            }
            db.query.mockImplementationOnce(() => {
                return { rows: [], fields: [] }
            });

            const fn = async () => {
                const response = await schema.findByIdWhere(id, conditions);
            }
            expect(fn()).rejects.toThrow();
        });
    });

    describe('create() functionality', () => {
        it('should throw if the body is not an object', async () => {
            const body = [];
            const fn = async () => {
                const response = await schema.create(body);
            }
            expect(fn()).rejects.toThrow();
        });

        it('should throw if the body length is bigger than the public columns inside of the class', async () => {
            const body = {
                title: 'title 1',
                extra: true,
            };
            const fn = async () => {
                const response = await schema.create(body);
            }
            expect(fn()).rejects.toThrow();
        });

        it('should throw if the keys of the body does not match the public columns inside of the class', async () => {
            const body = {
                titlee: 'title 1',
            };
            const fn = async () => {
                const response = await schema.create(body);
            }
            expect(fn()).rejects.toThrow();
        });

        it('should create an instance successfully', async () => {
            const findByIdMock = jest.spyOn(Schema.prototype, 'findById');
            const body = {
                title: 'title 1',
            };
            const db = new Database();
            const response = await schema.create(body);
            expect(db.query).toBeCalled();
            expect(findByIdMock).toBeCalledTimes(1);
            expect(response).toEqual({ rows: ['data'], fields: ['data'] });
        });
    });

    describe('findByIdAndUpdate() functionality', () => {
        it('should throw if the body is not an object', async () => {
            const id = 1;
            const body = [];

            const fn = async () => {
                const response = await schema.findByIdAndUpdate(id, body);
            }
            expect(fn()).rejects.toThrow();
        });
        it('should throw if the keys of the body does not match the public columns inside of the class', async () => {
            const id = 1;
            const body = {
                titlee: 'title 1',
            };

            const fn = async () => {
                const response = await schema.findByIdAndUpdate(id, body);
            }
            expect(fn()).rejects.toThrow();
        });

        it('should create an instance successfully', async () => {
            const findByIdMock = jest.spyOn(Schema.prototype, 'findById');
            const id = 1;
            const body = {
                title: 'title 2',
            };
            const db = new Database();
            const response = await schema.findByIdAndUpdate(id, body);
            expect(response).toEqual({ rows: ['data'], fields: ['data'] });
            expect(db.query).toBeCalled();
            expect(findByIdMock).toBeCalled();
        });
    });

    describe('findByIdAndUpdateWhere() functionality', () => {
        it('should throw if the body is not an object', async () => {
            const id = 1;
            const body = [];
            const conditions = {
                blog_id: 1
            }
            const fn = async () => {
                const response = await schema.findByIdAndUpdateWhere(id, body, conditions);
            }
            expect(fn()).rejects.toThrow();
        });
        it('should throw if the keys of the body does not match the public columns inside of the class', async () => {
            const id = 1;
            const body = {
                titlee: 'title 1',
            };
            const conditions = {
                blog_id: 1
            }
            const fn = async () => {
                const response = await schema.findByIdAndUpdateWhere(id, body, conditions);
            }
            expect(fn()).rejects.toThrow();
        });

        it('should create an instance successfully', async () => {
            const findByIdMock = jest.spyOn(Schema.prototype, 'findById');
            const id = 1;
            const body = {
                title: 'title 2',
            };
            const conditions = {
                blog_id: 1
            }
            const db = new Database();
            const response = await schema.findByIdAndUpdateWhere(id, body, conditions);
            expect(response).toEqual({ rows: ['data'], fields: ['data'] });
            expect(db.query).toBeCalled();
            expect(findByIdMock).toBeCalled();
        });
    })

    describe('findByIdAndDelete() functionality', () => {
        it('should throw if the user does not exists', async () => {
            const id = 100;
            const db = new Database();

            db.query.mockImplementationOnce(() => {
                return { rows: [], fields: [] }
            });

            const fn = async () => {
                const response = await schema.findByIdAndDelete(id);
            }
            expect(fn()).rejects.toThrow();
        });

        it('should delete the instance successfully', async () => {
            const id = 1;
            const db = new Database();
            const findByIdMock = jest.spyOn(Schema.prototype, 'findById');
            const response = await schema.findByIdAndDelete(id);

            expect(response).toEqual({ rows: ['data'], fields: ['data'] });
            expect(db.query).toBeCalled();
            expect(findByIdMock).toBeCalled();
        });
    });

    describe('findByIdAndDeleteWhere() functionality', () => {
        it('should throw if the user does not exists', async () => {
            const id = 100;
            const db = new Database();
            const conditions = {
                blog_id: 1
            }
            db.query.mockImplementationOnce(() => {
                return { rows: [], fields: [] }
            });

            const fn = async () => {
                const response = await schema.findByIdAndDeleteWhere(id, conditions);
            }
            expect(fn()).rejects.toThrow();
        });

        it('should delete the instance successfully', async () => {
            const id = 1;
            const db = new Database();
            const findByIdMock = jest.spyOn(Schema.prototype, 'findById');
            const conditions = {
                blog_id: 1
            }
            const response = await schema.findByIdAndDeleteWhere(id, conditions);

            expect(response).toEqual({ rows: ['data'], fields: ['data'] });
            expect(db.query).toBeCalled();
            expect(findByIdMock).toBeCalled();
        });
    })

    describe('countRows() functionality', () => {
        it('should return a number', async () => {
            const db = new Database();
            db.query.mockImplementationOnce(async () => {
                return Promise.resolve({ rows: [{ total: 5 }] });
            });

            const response = await schema.countRows();
            expect(response).toBe(5);
            expect(db.query).toBeCalled();
        });
    });

    describe('countRowsWhere() functionality', () => {
        it('should return a number', async () => {
            const db = new Database();
            db.query.mockImplementationOnce(async () => {
                return Promise.resolve({ rows: [{ total: 5 }] });
            });
            const conditions = {
                blog_id: 1
            }
            const response = await schema.countRowsWhere(conditions);
            expect(response).toBe(5);
            expect(db.query).toBeCalled();
        });
    });

    describe('query() funcitonality', () => {
        it('should throw if the query is not a string', async () => {
            const db = new Database();
            const query = [];
            const fn = async () => {
                const response = await schema.query(query);
            }
            expect(fn()).rejects.toThrow();
        });

        it('should perform a query successfully', async () => {
            const db = new Database();
            const query = 'SELECT * FROM TABLE';

            const response = await schema.query(query);

            expect(response).toEqual({ rows: ['data'], fields: ['data'] });
            expect(db.query).toBeCalled();
        });
    });

})