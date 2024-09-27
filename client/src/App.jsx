import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateUser from './EmployeeManagement/CreateUser';
import UpdateUser from './EmployeeManagement/UpdateUser';
import Users from './EmployeeManagement/Users';
import Dashboard from './EmployeeManagement/Dashboard'; // Import the Dashboard component
import Attendance from './EmployeeManagement/Attendance'; // Import Attendance component
import Payments from './EmployeeManagement/Payments'; // Import Payments component
import AttendanceRecords from './EmployeeManagement/AttendanceRecords'; // Import the new component
import Login from './EmployeeManagement/login';




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
