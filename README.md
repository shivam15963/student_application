# Student Application

#### Kinara Capital SDE Assignment
A web application for managing and displaying student data. The application includes a React frontend and an Express backend with support for multiple data sources including JSON, CSV, and MySQL.

## Features

- **Data Sources:** Supports data from JSON files, CSV files, and a MySQL database.
- **Filtering:** Allows filtering students by various attributes (name, age, total marks, grade).
- **Pagination:** Implements pagination to navigate through student records.
- **Responsive Design:** Designed to work on different screen sizes.

## Technologies Used

- **Frontend:**
  - React.js
  - Axios for HTTP requests
  - CSS for styling

- **Backend:**
  - Express.js
  - MySQL (for database)
  - csv-parser (for reading CSV files)
  - Node.js

## Installation

### Prerequisites

- Node.js and npm installed.
- MySQL server running.

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/student_application.git
   cd student_application
   ```

2. **Setup Backend:**

   - Navigate to the `backend` directory:

     ```bash
     cd backend
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Set up your MySQL database:

     - Make sure MySQL is running.
     - Create a database named `studentsdb` (or adjust the configuration accordingly).
     - Run the SQL script to set up the schema and sample data:

       ```bash
       node server.js
       ```

3. **Setup Frontend:**

   - Navigate to the `frontend` directory:

     ```bash
     cd ../frontend
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Start the React development server:

     ```bash
     npm start
     ```

   - The application should now be running on `http://localhost:3000`.

## Configuration

- **Backend:**
  - Configuration for MySQL is located in `backend/server.js`.
  - To switch data sources, adjust the `source` parameter in API requests.

- **Frontend:**
  - Configuration for the API endpoint is located in `frontend/src/components/StudentList.js`.

## API Endpoints

- **GET `/students`**: Fetch students with pagination and filtering.

  **Query Parameters:**
  - `page`: Page number.
  - `pageSize`: Number of students per page.
  - `filterBy`: Field to filter by (e.g., name, age).
  - `filterValue`: Value to filter by.
  - `source`: Data source (csv, json, db).


## Contact

For any questions or issues, please contact [shivammehla1999@gmail.com](mailto:shivammehla1999@gmail.com).
