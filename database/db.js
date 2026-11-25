require('dotenv').config(); // Load environment variables from .env file
const { Pool } = require('pg'); // Import the Pool class from the pg module

const pool = new Pool({
    host: process.env.DB_HOST, // Database host
    port: process.env.DB_PORT, // Database port
    user: process.env.DB_USER, // Database user
    password: process.env.DB_PASSWORD, // Database password
    database: process.env.DB_NAME, // Database name
});

module.exports = pool; // Export the pool instance for use in other modules