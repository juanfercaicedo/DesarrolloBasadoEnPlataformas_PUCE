const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

class DatabaseSingleton {
  constructor() {
    if (DatabaseSingleton.instance) {
      return DatabaseSingleton.instance;
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL es obligatoria para conectar con PostgreSQL.');
    }

    const databaseHost = new URL(connectionString).hostname;
    const isLocalDatabase = ['localhost', '127.0.0.1', '::1'].includes(databaseHost);
    const adapter = new PrismaPg({
      connectionString,
      ...(isLocalDatabase ? {} : { ssl: { rejectUnauthorized: true } })
    });
    this.client = new PrismaClient({ adapter });
    DatabaseSingleton.instance = this;
  }
}

module.exports = new DatabaseSingleton();