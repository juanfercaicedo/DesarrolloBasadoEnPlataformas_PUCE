const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

class DatabaseSingleton {
  constructor() {
    if (DatabaseSingleton.instance) {
      return DatabaseSingleton.instance;
    }

    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL
    });
    this.client = new PrismaClient({ adapter });
    DatabaseSingleton.instance = this;
  }
}

module.exports = new DatabaseSingleton();