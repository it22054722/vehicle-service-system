import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateUser from './EmployeeManagement/CreateUser';
import UpdateUser from './EmployeeManagement/UpdateUser';
import Users from './EmployeeManagement/Users';
import ServiceDashboard from './EmployeeManagement/Dashboard'; // Import the Dashboard component
import Attendance from './EmployeeManagement/Attendance'; // Import Attendance component
import Payments from './EmployeeManagement/Payments'; // Import Payments component
import AttendanceRecords from './EmployeeManagement/AttendanceRecords'; // Import the new component
import Login from './EmployeeManagement/login';

import Services from './ServiceRecordManagement/Services'
import CreateService from './ServiceRecordManagement/CreateService'
import UpdateService from './ServiceRecordManagement/UpdateService'
import ServiceReports from './ServiceRecordManagement/serviceReports'
import QRCodePage from './ServiceRecordManagement/QRCodePage'
import ServiceDetails from './ServiceRecordManagement/ServiceDetails'
import PartsUsagePieChart from './ServiceRecordManagement/PartsUsagePieChart'
import ServiceDashboard from './ServiceRecordManagement/ServiceDashboard'
import SerDescription from './ServiceRecordManagement/SerDescription'
import PackageHeader from './ServiceRecordManagement/PackageHeader'
import Footer from './ServiceRecordManagement/Footer';
import ServiceLogin from './ServiceRecordManagement/serviceLogin'
import PINPage from './ServiceRecordManagement/PINPage'
import Home from './ServiceRecordManagement/Home'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
      <PackageHeader/>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/serviceDashboard' element={<ServiceDashboard />}></Route>
        <Route path='/servicecreate' element={<CreateService />}></Route>
        <Route path='/serviceupdate/:id' element={<UpdateService />}></Route>
        <Route path='/Servicereports' element={<ServiceReports />}></Route>
        <Route path='/serviceeqrCodes' element={<QRCodePage />}></Route>
        <Route path="/service/:vin" element={<ServiceDetails />} />
        <Route path="/servicepartsusage" element={<PartsUsagePieChart />} />
        <Route path="/serviceRecords" element={<Services />} />
        <Route path="/SerDescription" element={<SerDescription />} />
        <Route path="/serviceLogin" element={<ServiceLogin />} />
        <Route path="/PINPage" element={<PINPage />} />

        <Route path='/' element={<Login />} /> {/* Login page */}
        <Route path='/dashboard' element={<Dashboard />} /> {/* Dashboard as the landing page */}
        <Route path='/users' element={<Users />} />
        <Route path='/create' element={<CreateUser />} />
        <Route path='/update/:id' element={<UpdateUser />} />
        <Route path='/attendance' element={<Attendance />} />
        <Route path='/payments' element={<Payments />} />
        <Route path='/attendanceRecords' element={<AttendanceRecords />} /> {/* New route */}
        
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default App;
