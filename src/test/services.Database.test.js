
jest.mock('mysql2', () => {
    return {
        createPool: jest.fn().mockReturnValue({
            getConnection: jest.fn(),
            promise: jest.fn().mockReturnValue({
                query: jest.fn().mockResolvedValue(['rows', 'fields']),
            })
        }),
    }
});

const mysql = require('mysql2');
const Database = require('../services/Database');



describe('Database Class Unit Test', () => {

    let db = null;

    beforeEach(() => {
        db = new Database();
        jest.restoreAllMocks();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe('constructor functionality', () => {

        it('should run the mysql instantiation routing', () => {
            const pool = mysql.createPool();

            expect(mysql.createPool).toBeCalled();
            expect(pool.getConnection).toBeCalled();
            expect(pool.promise).toBeCalled()
        });

        it('should return the same instance in two different objects', () => {
            // Validates that the singleton design pattern
            // was implemented successfully
            const db1 = new Database();
            const db2 = new Database();
            expect(db1 === db2).toBe(true);
        });
    });

    describe('query method functionality', () => {
        
        it('should execute the query fn', async () => {
            const pool = mysql.createPool();
            const query = 'Select * from table';
            const dbRef = db;
            const fn = async () => {
                return await dbRef.query(query);
            }
            console.log(await fn())
            expect(fn()).resolves.toEqual({rows: 'rows', fields: 'fields'});
        })
    });
})