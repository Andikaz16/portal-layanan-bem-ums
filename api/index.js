// Vercel Serverless Function entry point
// This wraps our Express app as a serverless function

// Load environment variables
require('dotenv').config({ path: require('path').resolve(__dirname, '../server/.env') });

const app = require('../server/src/app');

module.exports = app;
