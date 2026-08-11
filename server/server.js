const app = require('./src/app');
const env = require('./src/config/env');
const { pool } = require('./src/config/database');

/**
 * ═══════════════════════════════════════════════════
 * Server Entry Point
 * Portal Advokasi Terpadu BEM
 * ═══════════════════════════════════════════════════
 */

const startServer = async () => {
  try {
    // Test database connection
    const client = await pool.connect();
    console.log('✅ PostgreSQL connection established');
    client.release();

    // Start Express server
    app.listen(env.port, () => {
      console.log(`
  ╔═══════════════════════════════════════════════════╗
  ║   🏛️  Portal Advokasi Terpadu BEM                ║
  ║   🚀 Server running on port ${env.port}               ║
  ║   🌍 Environment: ${env.nodeEnv.padEnd(28)}║
  ║   📡 API Base: http://localhost:${env.port}/api/v1     ║
  ╚═══════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('\n💡 Pastikan PostgreSQL sudah berjalan dan konfigurasi .env sudah benar.');
    process.exit(1);
  }
};

// ─── Graceful Shutdown ───
const shutdown = async (signal) => {
  console.log(`\n📴 ${signal} received. Shutting down gracefully...`);
  await pool.end();
  console.log('📦 Database pool closed');
  process.exit(0);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ─── Unhandled Errors ───
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

startServer();
