// App.js
import React from 'react';
import StudentList from './components/StudentList';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <main>
        <StudentList />
      </main>
    </div>
  );
};

export default App;
