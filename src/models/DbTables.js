
const pg = require('pg');

let connection = process.env.DATABASE_URL || 'postgresql://postgres:christinme@localhost:5432/ft_shiloh2019_serviceteam';//process.env.DB_CONNECT || process.env.DATABASE_URL_DEV || process.env.DATABASE_URL;

const pool = new pg.Pool({
  connectionString: connection
});

pool.on('connect', () => console.log('DBTables:connected to DB with : ', connection));


// TBquery : a collection of CREATE TABLE queries for DB
// Optionally specify the < project > 
const util = (TBquery, project = '') => {
  pool.query(TBquery)
    .then(result => {
      console.log(`success: created ${project} tables`);
      pool.end();
    })
    .catch(e => {
      console.log(`error: failed to create ${project} tables`, e);
      pool.end();
    });
}

const createTables = () => {
  const tableQuery = `
  -- Create Members Table 
    CREATE TABLE IF NOT EXISTS
    members(
      user_id SERIAL NOT NULL PRIMARY KEY,
      unit_id VARCHAR(255) NOT NULL UNIQUE,
      surname VARCHAR(255) NOT NULL ,
      firstname VARCHAR(255) NOT NULL ,
      
      unit VARCHAR(255) NOT NULL ,     
      gender VARCHAR(255) NOT NULL ,
      phone VARCHAR(255) NOT NULL UNIQUE,
      station VARCHAR(255) NOT NULL,
     
      availability TEXT[] NOT NULL,
      otp VARCHAR(255) NOT NULL UNIQUE, 
      entry_date DATE NOT NULL DEFAULT NOW()
    );
    
  -- Create Qualifiers Table 
    CREATE TABLE IF NOT EXISTS
    units(
      id SERIAL NOT NULL PRIMARY KEY,
      unit_id VARCHAR(255) NOT NULL UNIQUE,
      unit VARCHAR(255) NOT NULL UNIQUE,
      unit_logo VARCHAR(255) 
    );
  `;
  // Run the Query
  util(tableQuery, 'ft-shiloh2019-serviceteam');
}

// Export for use in command line
module.exports = {
  createTables,
  pool
};
require('make-runnable');