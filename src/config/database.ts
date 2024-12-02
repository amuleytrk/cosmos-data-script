import { ConnectionPool } from 'mssql';

class Database {
    private static instance: Database;

    private pool: ConnectionPool | null = null;

    private constructor() {}

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<void> {
        if (this.pool && this.pool.connected) {
            return;
        }

        const config = {
            user: process.env.SQL_USERNAME || '',
            password: process.env.SQL_PASSWORD || '',
            server: process.env.SQL_SERVER || '',
            database: process.env.SQL_DB || '',
            options: {
                encrypt: true,
                enableAritAbort: true,
                trustServerCertificate: true,
            },
            pool: {
                max: 10,
                min: 5,
                idleTimeoutMillis: 30000
            }
        };

        try {
            this.pool = new ConnectionPool(config);
            await this.pool.connect();
            console.log('Connected to MSSQL');
        } catch (error) {
            console.log('Database connection failed: ', error);
        }
    }

    private isPoolInitialized(
        pool: ConnectionPool | null
    ): pool is ConnectionPool {
        return pool !== null;
    }

    public async getPool(): Promise<ConnectionPool> {
        if (!this.isPoolInitialized(this.pool) || !this.pool.connected) {
            await this.connect();
        }
        return this.pool!;
    }
}

export default Database;
