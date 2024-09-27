import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import Users from './Users';
import Dashboard from './Dashboard'; // Import the Dashboard component
import Attendance from './Attendance'; // Import Attendance component
import Payments from './Payments'; // Import Payments component
import AttendanceRecords from './AttendanceRecords'; // Import the new component
import Login from './login';




function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} /> {/* Login page */}
          <Route path='/dashboard' element={<Dashboard />} /> {/* Dashboard as the landing page */}
          <Route path='/users' element={<Users />} />
          <Route path='/create' element={<CreateUser />} />
          <Route path='/update/:id' element={<UpdateUser />} />
          <Route path='/attendance' element={<Attendance />} />
          <Route path='/payments' element={<Payments />} />
          <Route path='/attendanceRecords' element={<AttendanceRecords />} /> {/* New route */}

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
