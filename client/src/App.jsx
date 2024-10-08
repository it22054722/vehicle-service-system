import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateUser from './EmployeeManagement/CreateUser';
import UpdateUser from './EmployeeManagement/UpdateUser';
import Users from './EmployeeManagement/Users';
import EmpDashboard from './EmployeeManagement/Dashboard'; // Import the Dashboard component
import Attendance from './EmployeeManagement/Attendance'; // Import Attendance component
import Payments from './EmployeeManagement/Payments'; // Import Payments component
import AttendanceRecords from './EmployeeManagement/AttendanceRecords'; // Import the new component
import Login from './EmployeeManagement/login';

import Services from './ServiceRecordManagement/Services'
import CreateService from './ServiceRecordManagement/CreateService'
import UpdateService from './ServiceRecordManagement/UpdateService'
import ServiceReports from './ServiceRecordManagement/ServiceReports';
import QRCodePage from './ServiceRecordManagement/QRCodePage'
import ServiceDetails from './ServiceRecordManagement/ServiceDetails'
import PartsUsagePieChart from './ServiceRecordManagement/PartsUsagePieChart'
import ServiceDashboard from './ServiceRecordManagement/ServiceDashboard'
import SerDescription from './ServiceRecordManagement/SerDescription'
import PackageHeader from './ServiceRecordManagement/PackageHeader'
import Footer from './ServiceRecordManagement/Footer';
import ServiceLogin from './ServiceRecordManagement/ServiceLogin';
import PINPage from './ServiceRecordManagement/PINPage'
import Home from './ServiceRecordManagement/Home'
import AboutUs from './ServiceRecordManagement/About';

import CreateTrainee from './TraineeManagement/CreateTrainee'
import UpdateTrainee from './TraineeManagement/UpdateTrainee'
import Trainees from './TraineeManagement/Trainees'
import Schedule from './TraineeManagement/Schedule'
import Prograss from './TraineeManagement/Prograss'
import Report from './TraineeManagement/Report'
import Dashboard from './TraineeManagement/Dashboard'
import TraineeLogin from './TraineeManagement/TraineeLogin';
import TaskProgress from './TraineeManagement/TaskProgress';



import 'bootstrap/dist/css/bootstrap.min.css';
import AppTable from './AppointmentManagement/AppTable';
import Createappointment from './AppointmentManagement/Createappointment';
import Updateappointment from './AppointmentManagement/Updateappointment';



import AddFeed from "./FeedbackManagment/Addfeedback";
import Managefeedback from "./FeedbackManagment/Managefeedback";
import DashboardLayout from "./FeedbackManagment/Dashboard";
import Update from "./FeedbackManagment/updatefeed";
import Allfeedback from "./FeedbackManagment/Allfeedback";
import Massage from "./FeedbackManagment/massage";
import Mangerview from "./FeedbackManagment/Mangerview";
import FeedbackSummery from "./FeedbackManagment/FeedbackSummery";



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
        <Route path="/AboutUs" element={<AboutUs />} />


        <Route path='/empLogin' element={<Login />} /> {/* Login page */}
        <Route path='/dashboard' element={<EmpDashboard />} /> {/* Dashboard as the landing page */}
        <Route path='/users' element={<Users />} />
        <Route path='/create' element={<CreateUser />} />
        <Route path='/update/:id' element={<UpdateUser />} />
        <Route path='/attendance' element={<Attendance />} />
        <Route path='/payments' element={<Payments />} />
        <Route path='/attendanceRecords' element={<AttendanceRecords />} /> {/* New route */}

        <Route path='/traineedashboard' element={<Dashboard/>}></Route>{/* Setting Dashboard as the landing page */}
        <Route path='/trainee' element={<Trainees/>}></Route>
        <Route path='/traineecreate' element={<CreateTrainee/>}></Route>
        <Route path='/traineeupdate/:id' element={<UpdateTrainee/>}></Route>
        <Route path='/traineeschedule' element={<Schedule/>}></Route>
        <Route path='/traineeprogess' element={<Prograss/>}></Route>
        <Route path='/report' element={<Report/>}></Route>
        <Route path='/traineelogin' element={<TraineeLogin/>}></Route>
        <Route path='/TaskProgress' element={<TaskProgress/>}></Route>
        
        <Route path="/AppTable" element={<AppTable />} />
        <Route path="/Createappointment" element={<Createappointment />} />
        <Route path="/Updateappointment/:id" element={<Updateappointment />} />



        <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="AddFeed" element={<AddFeed />} />
          <Route path="allfeed" element={<Allfeedback />} />
          <Route path="manage" element={<Managefeedback />} />
          <Route path="massage" element={<Massage />} />
          <Route path="feedupdate/:Id" element={<Update />} />
          
          </Route>
          <Route path="/Mangeview" element={<Mangerview />} />
          <Route path="/pages/FeedbackSummery" element={<FeedbackSummery />} />
          <Route path="/feed" element={<Allfeedback />} />
          





      </Routes>



     




      <Footer/>
      </BrowserRouter>
    </div>
  )
}




export default App;
