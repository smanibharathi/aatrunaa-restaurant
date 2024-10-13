const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'kutty', // replace with your MySQL password
    database: 'aatrunaa_feedback', // replace with your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// Middleware to parse incoming requests and static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login credentials (assuming it's hardcoded for simplicity)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'aatrunaa' && password === 'AAtrunaa@123') {
        res.redirect('/admin-dashboard');
    } else {
        res.status(401).send('Invalid Username or Password');
    }
});

app.get('/admin-dashboard', (req, res) => {
    const query = 'SELECT * FROM feedback LIMIT 10'; // Fetching only 10 records for pagination
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching feedback data');
        }
        
        let feedbackTable = `
        <html>
        <head>
            <title>Admin Dashboard</title>
            <link rel="stylesheet" href="/css/dashboard.css">
        </head>
        <body>
        <div class="container">
        <h2>Admin Dashboard - Feedback Data</h2>
        <table>
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Rating</th>
            <th>Feedback</th>
            <th>Submitted At</th>
        </tr>`;
        
        results.forEach(feedback => {
            feedbackTable += `
            <tr>
                <td>${feedback.id}</td>
                <td>${feedback.name}</td>
                <td>${feedback.phone}</td>
                <td>${feedback.email}</td>
                <td>${feedback.rating}</td>
                <td>${feedback.feedback}</td>
                <td>${feedback.submitted_at}</td>
            </tr>`;
        });
        
        feedbackTable += `</table></div></body></html>`;
        
        res.send(feedbackTable);
    });
});



// Handle form submission
app.post('/submit_feedback', (req, res) => {
    const { name, phone, email, rating, feedback } = req.body;

    const query = 'INSERT INTO feedback (name, phone, email, rating, feedback) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, phone, email, rating, feedback], (err, result) => {
        if (err) {
            return res.status(500).send('Error while submitting feedback');
        }
        // Redirect to the Google review page after successful form submission
        res.redirect('https://g.page/r/CQP2E5EHAlqHEBM/review');
    });
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
