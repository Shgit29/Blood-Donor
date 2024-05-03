// const LocalStrategy = require("passport-local");
// const passport = require('passport');
// const parseDbUrl = require('parse-database-url');
// const db = require("./db");

// const tableName = "users";

// (async () => {
//   try {
//     const queryText = `
//       CREATE TABLE IF NOT EXISTS ${tableName} (
//         id SERIAL PRIMARY KEY
//       );
//     `;

//     await db.query(queryText);
//     console.log(`Table '${tableName}' created successfully!`);
//   } catch (error) {
//     console.error("Error creating table:", error);
//   }
// })();

// users.