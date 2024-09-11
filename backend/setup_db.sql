-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS studentsdb;

-- Use the studentsdb database
USE studentsdb;

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    age INT,
    totalMarks INT,
    grade VARCHAR(10)
);
