import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported only once
import "./App.css";

/* Employee Management Imports */
import CreateUser from "./EmployeeManagement/CreateUser";
import UpdateUser from "./EmployeeManagement/UpdateUser";
import Users from "./EmployeeManagement/Users";
import EmpDashboard from "./EmployeeManagement/Dashboard";
import Attendance from "./EmployeeManagement/Attendance";
import Payments from "./EmployeeManagement/Payments";
import AttendanceRecords from "./EmployeeManagement/AttendanceRecords";
import Login from "./EmployeeManagement/login";

/* Service Record Management Imports */
import Services from "./ServiceRecordManagement/Services";
import CreateService from "./ServiceRecordManagement/CreateService";
import UpdateService from "./ServiceRecordManagement/UpdateService";
import ServiceReports from "./ServiceRecordManagement/ServiceReports";
import QRCodePage from "./ServiceRecordManagement/QRCodePage";
import ServiceDetails from "./ServiceRecordManagement/ServiceDetails";
import PartsUsagePieChart from "./ServiceRecordManagement/PartsUsagePieChart";
import ServiceDashboard from "./ServiceRecordManagement/ServiceDashboard";
import SerDescription from "./ServiceRecordManagement/SerDescription";
import ServiceLogin from "./ServiceRecordManagement/ServiceLogin";
import PINPage from "./ServiceRecordManagement/PINPage";
import Home from "./ServiceRecordManagement/Home";
import AboutUs from "./ServiceRecordManagement/About";

/* Trainee Management Imports */
import CreateTrainee from "./TraineeManagement/CreateTrainee";
import UpdateTrainee from "./TraineeManagement/UpdateTrainee";
import Trainees from "./TraineeManagement/Trainees";
import Schedule from "./TraineeManagement/Schedule";
import Progress from "./TraineeManagement/Prograss";
import Report from "./TraineeManagement/Report";
import TraineeDashboard from "./TraineeManagement/Dashboard";
import TraineeLogin from "./TraineeManagement/TraineeLogin";

/* Appointment Management Imports */
import AppTable from "./AppointmentManagement/AppTable";
import CreateAppointment from "./AppointmentManagement/Createappointment";
import UpdateAppointment from "./AppointmentManagement/Updateappointment";

/* Feedback Management Imports */
import AddFeed from "./FeedbackManagment/Addfeedback";
import ManageFeedback from "./FeedbackManagment/Managefeedback";
import FeedbackDashboard from "./FeedbackManagment/Dashboard";
import UpdateFeedback from "./FeedbackManagment/updatefeed";
import AllFeedback from "./FeedbackManagment/Allfeedback";
import Massage from "./FeedbackManagment/massage";
import ManagerView from "./FeedbackManagment/Mangerview";
import FeedbackSummary from "./FeedbackManagment/FeedbackSummery";

/* Shared Components */
import PackageHeader from "./ServiceRecordManagement/PackageHeader";
import Footer from "./ServiceRecordManagement/Footer";

/* Inventory Management Imports */
import Inventory from "./InventoryManagement/Inventory";
import UpdateItem from "./InventoryManagement/UpdateItem";
import InventoryDashboard from "./InventoryManagement/InventoryDashboard";
import CreateItem from "./InventoryManagement/CreateItem";
import LowInventory from "./InventoryManagement/LowInventory";


function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <BrowserRouter>
        <PackageHeader />
        <Routes>
          {/* Home Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/AboutUs" element={<AboutUs />} />

          {/* Service Record Management Routes */}
          <Route path="/serviceDashboard" element={<ServiceDashboard />} />
          <Route path="/servicecreate" element={<CreateService />} />
          <Route path="/serviceupdate/:id" element={<UpdateService />} />
          <Route path="/serviceReports" element={<ServiceReports />} />
          <Route path="/serviceQrCodes" element={<QRCodePage />} />
          <Route path="/service/:vin" element={<ServiceDetails />} />
          <Route path="/servicePartsUsage" element={<PartsUsagePieChart />} />
          <Route path="/serviceRecords" element={<Services />} />
          <Route path="/SerDescription" element={<SerDescription />} />
          <Route path="/serviceLogin" element={<ServiceLogin />} />
          <Route path="/PINPage" element={<PINPage />} />

          {/* Employee Management Routes */}
          <Route path="/empLogin" element={<Login />} />
          <Route path="/dashboard" element={<EmpDashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/create" element={<CreateUser />} />
          <Route path="/update/:id" element={<UpdateUser />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/attendanceRecords" element={<AttendanceRecords />} />

          {/* Trainee Management Routes */}
          <Route path="/traineeDashboard" element={<TraineeDashboard />} />
          <Route path="/trainee" element={<Trainees />} />
          <Route path="/traineeCreate" element={<CreateTrainee />} />
          <Route path="/traineeUpdate/:id" element={<UpdateTrainee />} />
          <Route path="/traineeSchedule" element={<Schedule />} />
          <Route path="/traineeProgress" element={<Progress />} />
          <Route path="/report" element={<Report />} />
          <Route path="/traineeLogin" element={<TraineeLogin />} />

          {/* Appointment Management Routes */}
          <Route path="/AppTable" element={<AppTable />} />
          <Route path="/createAppointment" element={<CreateAppointment />} />
          <Route
            path="/updateAppointment/:id"
            element={<UpdateAppointment />}
          />

          {/* Feedback Management Routes */}
          <Route path="/feedbackDashboard" element={<FeedbackDashboard />}>
            <Route path="addFeed" element={<AddFeed />} />
            <Route path="allFeed" element={<AllFeedback />} />
            <Route path="manage" element={<ManageFeedback />} />
            <Route path="massage" element={<Massage />} />
            <Route path="feedUpdate/:id" element={<UpdateFeedback />} />
          </Route>
          <Route path="/managerView" element={<ManagerView />} />
          <Route path="/pages/FeedbackSummary" element={<FeedbackSummary />} />
          <Route path="/feed" element={<AllFeedback />} />

          {/*Inventory Management Routes */}
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventoryupdate/:id" element={<UpdateItem />} /> 
          <Route path="/inventoryDashboard" element={<InventoryDashboard />} />
          <Route path="/inventoryCreate" element={<CreateItem />} />
          <Route path="/low-inventory" element={<LowInventory />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
