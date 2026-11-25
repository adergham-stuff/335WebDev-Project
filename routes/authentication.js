const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../database/db'); // Import the database connection pool


router.post('/signup', function (req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    if(typeof username !== 'string' || 
        typeof password !== 'string' ||
        !username.trim() ||
        !password.trim() ||
        username.length > 50 || // Limit i also made in the table
        Buffer.byteLength(password, 'utf8') > 72 // bcrypt has a limit of 72 bytes for the password
        ){

        return res.status(400).json({
            message: 'Invalid username or password'
        })
    }
    // search for the username in the database to check if it already exists
    pool.query('SELECT * FROM users WHERE username = $1',
        [username], function (err, result) {
            if (err) {
                console.log("Unable to query SELECT");
                return next(err);
            }


            // Check if the username already exists
            if (result.rows.length > 0) {
                return res.status(409).json({
                    message: 'Username already exists'
                });
            }

            // If the username does not exist, hash the password and insert the new user into the database
            //10 is the amount of work bcrypt will do to hash the password. The higher the number, the more secure but also the slower it will be.
            let hashedPassword = bcrypt.hashSync(password, 10);
            pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)',
            [username, hashedPassword], function(err, result){
                if(err){
                    console.log("Unable to query INSERT");
                    return next(err);
                }
                //could chose to redirect to login page or return a success message. For now, we will return a success message.
                return res.status(201).json({
                    message: 'User created successfully'
                });
            });
        });
});



module.exports = router; // Export the router for use in other modules
