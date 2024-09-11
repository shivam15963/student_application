const express = require('express');
const fs = require('fs');
const mysql = require('mysql2');
const cors = require('cors');
const csvParser = require('csv-parser');
const app = express();
const port = 3001;

// MySQL connection configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: '', // Your MySQL password
    database: 'studentsdb' // Your database name
});

// Middleware
app.use(cors());

// Function to run SQL file for database initialization
const runSQLFile = (filePath, callback) => {
    const sql = fs.readFileSync(filePath, 'utf8');
    db.query(sql, (err) => {
        if (err) {
            console.error('Error running SQL file:', err);
        } else {
            console.log(`SQL file ${filePath} executed successfully`);
        }
        if (callback) callback();
    });
};

// Load students from JSON file
const loadStudentsFromJSON = () => {
    const data = fs.readFileSync('students.json');
    return JSON.parse(data);
};

// Load students from CSV file
const loadStudentsFromCSV = (callback) => {
    const results = [];
    fs.createReadStream('students.csv')
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            callback(results);
        })
        .on('error', (error) => {
            console.error('Error reading CSV file:', error);
            callback([]);
        });
};

// Load students from MySQL database
const loadStudentsFromDB = (callback) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            callback([]);
        } else {
            callback(results);
        }
    });
};

// Fetch students based on the source
const fetchStudents = (source, callback) => {
    switch (source) {
        case 'csv':
            loadStudentsFromCSV(callback);
            break;
        case 'json':
            callback(loadStudentsFromJSON());
            break;
        case 'db':
            loadStudentsFromDB(callback);
            break;
        default:
            callback(loadStudentsFromJSON()); // Default to JSON if source is unknown
            break;
    }
};

// API endpoint to return paginated and dynamically filtered student details
app.get('/students', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const filterBy = req.query.filterBy || ''; // e.g., 'name', 'grade', 'age', etc.
    const filterValue = req.query.filterValue || ''; // Value to filter
    const source = req.query.source || 'json'; // Data source (csv, json, db)

    // Fetch students based on the specified source
    fetchStudents(source, (students) => {
        // Apply filtering if filterBy and filterValue are provided
        if (filterBy && filterValue) {
            students = students.filter(student => {
                const studentValue = student[filterBy] ? student[filterBy].toString().toLowerCase() : '';
                return studentValue.includes(filterValue.toLowerCase());
            });
        }

        // Apply pagination
        const totalRecords = students.length;
        const start = (page - 1) * pageSize;
        const paginatedStudents = students.slice(start, start + pageSize);

        // Respond with paginated and filtered student data
        res.json({
            students: paginatedStudents,
            totalRecords: totalRecords,
            page: page,
            pageSize: pageSize,
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
