const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  __internal: {
    engine: {
      enableQueryLogging: false,
      // disable prepared statements
      enableEngineDebugMode: false,
      maxPreparedStatements: 0
    }
  }
});

module.exports = prisma;
