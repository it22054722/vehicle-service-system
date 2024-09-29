import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppTable from './AppointmentManagement/AppTable';
import Createappointment from './AppointmentManagement/Createappointment';
import Updateappointment from './AppointmentManagement/Updateappointment';
import PackageHeader from './AppointmentManagement/packageHeader'; // Match with the correct casing of the file name
import Footer from './AppointmentManagement/Footer';
import Home from './AppointmentManagement/Home';

function App() {
    return (
        <div>
            <div className="overlay"></div> {/* Optional overlay */}
            <div className="content">
                <BrowserRouter>
                    <PackageHeader />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/AppTable" element={<AppTable />} />
                        <Route path="/Createappointment" element={<Createappointment />} />
                        <Route path="/Updateappointment/:id" element={<Updateappointment />} />
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
