import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/StudentList.css';

const StudentList = () => {
    // State variables
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(8); // Number of students per page
    const [totalRecords, setTotalRecords] = useState(0);
    const [filterBy, setFilterBy] = useState('name'); // Field to filter by
    const [filterValue, setFilterValue] = useState(''); // Value to filter
    const [source] = useState('json'); // Data source (json, csv, db)

    // Fetch students from the server
    const fetchStudents = useCallback(async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/students', {
                params: {
                    page,
                    pageSize,
                    filterBy,
                    filterValue,
                    source
                }
            });
            setStudents(data.students);
            setTotalRecords(data.totalRecords);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    }, [page, pageSize, filterBy, filterValue, source]);

    // Load students whenever page, filterBy, or filterValue changes
    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Handle filter changes and reset page to 1
    const handleFilter = () => {
        setPage(1);
        fetchStudents();
    };

    // Handle page changes
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Calculate total number of pages
    const totalPages = Math.ceil(totalRecords / pageSize);

    // Generate an array of page numbers
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="student-container">
            <h1 className="title">Student List</h1>

            <div className="filter-container">
                <select
                    className="filter-select"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                >
                    <option value="name">Name</option>
                    <option value="age">Age</option>
                    <option value="totalMarks">Total Marks</option>
                    <option value="grade">Grade</option>
                </select>
                <input
                    type="text"
                    className="filter-input"
                    placeholder={`Filter by ${filterBy}`}
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                />
                <button className="filter-button" onClick={handleFilter}>Filter</button>
            </div>

            <div className="student-grid">
                {students.map((student) => (
                    <div className="student-card" key={student.id}>
                        <h2>{student.name}</h2>
                        <p>Age: {student.age}</p>
                        <p>Total Marks: {student.totalMarks}</p>
                        <p>Grade: {student.grade}</p>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button 
                    className="page-button" 
                    disabled={page === 1} 
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </button>
                
                {pageNumbers.map((number) => (
                    <button 
                        key={number}
                        className={`page-button-numeric ${number === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(number)}
                    >
                        {number}
                    </button>
                ))}

                <button 
                    className="page-button" 
                    disabled={page === totalPages} 
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default StudentList;