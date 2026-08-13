const db = require('../server/src/config/database');

async function check() {
  try {
    const res = await db.query(`
      SELECT table_name, column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE character_maximum_length = 500;
    `);
    console.log(res.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
