const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Buddha%55',
    database: 'todo_app',
});

// Connect to the database
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Render the list of todos
app.get('/', (req, res) => {
    connection.query('SELECT * FROM todos', (err, results) => {
        if (err) throw err;
        res.render('index', { todos: results });
    });
});

// Create a new todo
app.post('/todos', (req, res) => {
    const { title } = req.body;
    connection.query('INSERT INTO todos (title) VALUES (?)', [title], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Update the completion status of a todo
app.post('/todos/:id', (req, res) => {
    const id = req.params.id;
    const completed = req.body.completed === 'true';
    connection.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Delete a todo
app.post('/todos/:id/delete', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
