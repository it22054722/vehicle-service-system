import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Services from './Services'
import CreateService from './CreateService'
import UpdateService from './UpdateService'
import ServiceReports from './serviceReports'
import QRCodePage from './QRCodePage'
import ServiceDetails from './ServiceDetails'
import PartsUsagePieChart from './PartsUsagePieChart'
import Dashboard from './Dashboard'
import SerDescription from './SerDescription'
import PackageHeader from './PackageHeader'
import Footer from './Footer';
import ServiceLogin from './serviceLogin'
import PINPage from './PINPage'
import Home from './Home'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
      <PackageHeader/>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/Dashboard' element={<Dashboard />}></Route>
        <Route path='/create' element={<CreateService />}></Route>
        <Route path='/update/:id' element={<UpdateService />}></Route>
        <Route path='/reports' element={<ServiceReports />}></Route>
        <Route path='/qrCodes' element={<QRCodePage />}></Route>
        <Route path="/service/:vin" element={<ServiceDetails />} />
        <Route path="/parts-usage" element={<PartsUsagePieChart />} />
        <Route path="/services" element={<Services />} />
        <Route path="/SerDescription" element={<SerDescription />} />
        <Route path="/serviceLogin" element={<ServiceLogin />} />
        <Route path="/PINPage" element={<PINPage />} />
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default App
