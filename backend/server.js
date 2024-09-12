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
    password: 'root', // Your MySQL password
    database: 'studentsdb' // Your database name
});

// Middleware
app.use(cors());

// Middleware to handle JSON parsing errors
app.use(express.json());

// MySQL connection error handling
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1); // Exit the application if there's an error connecting to MySQL
    } else {
        console.log('Connected to MySQL');
    }
});

// Load students from JSON file with error handling
const loadStudentsFromJSON = () => {
    try {
        const data = fs.readFileSync('students.json');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        return []; // Return an empty array in case of an error
    }
};

// Load students from CSV file with error handling
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
            callback([]); // Return an empty array in case of an error
        });
};

// Load students from MySQL database with error handling
const loadStudentsFromDB = (callback) => {
    db.query('SELECT * FROM students', (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            callback([]); // Return an empty array in case of an error
        } else {
            callback(results);
        }
    });
};

// Fetch students based on the source with error handling
const fetchStudents = (source, callback) => {
    try {
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
                throw new Error('Invalid source provided'); // Handle invalid source error
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        callback([]); // Return an empty array in case of an error
    }
};

// API endpoint to return paginated and dynamically filtered student details
app.get('/students', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 8;
    const filterBy = req.query.filterBy || ''; // e.g., 'name', 'grade', 'age', etc.
    const filterValue = req.query.filterValue || ''; // Value to filter
    const source = req.query.source || 'json'; // Data source (csv, json, db)

    // Fetch students based on the specified source
    fetchStudents(source, (students) => {
        if (!students.length) {
            return res.status(500).json({ message: 'No students found or error occurred while fetching data.' });
        }

        try {
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
        } catch (error) {
            console.error('Error processing student data:', error);
            res.status(500).json({ message: 'Error processing student data' });
        }
    });
});

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});