const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Create MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",      // Change this if your MySQL user is different
    password: "",      // Your MySQL password
    database: "signup" // Your MySQL database name
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to database.");
});

// Signup route
app.post('/signup', (req, res) => {
    const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password // Store the password as entered (not hashed)
    ];

    db.query(sql, [values], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error inserting data" });
        }
        return res.status(201).json({ message: "Signup successful" });
    });
});

// Login route
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM login WHERE email = ?";
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error querying data" });
        }
        if (data.length > 0) {
            // Check if the password matches the stored password
            if (req.body.password === data[0].password) {
                return res.json({ message: "Success" });
            } else {
                return res.json({ message: "Invalid password" });
            }
        } else {
            return res.json({ message: "Email not found" });
        }
    });
});

// Start the server
app.listen(8081, () => {
    console.log("Listening on port 8081");
});
