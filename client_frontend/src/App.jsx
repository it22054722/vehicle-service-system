import { useState } from 'react'
import './App.css'
import{BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import CreateTrainee from './TraineeManagement/CreateTrainee'
import UpdateTrainee from './TraineeManagement/UpdateTrainee'
import Trainees from './TraineeManagement/Trainees'
import Schedule from './TraineeManagement/Schedule'
import Prograss from './TraineeManagement/Prograss'
import Report from './TraineeManagement/Report'
import Dashboard from './TraineeManagement/Dashboard'
import PackageHeader from './TraineeManagement/PackageHeader'
import Footer from './TraineeManagement/Footer'
import Login from './TraineeManagement/TraineeLogin'
import Home from './TraineeManagement/Home'




function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
       
      <BrowserRouter>
      <PackageHeader/>
      <Routes>
        <Route path='/traineedashboard' element={<Dashboard/>}></Route>{/* Setting Dashboard as the landing page */}
        <Route path='/trainee' element={<Trainees/>}></Route>
        <Route path='/traineecreate' element={<CreateTrainee/>}></Route>
        <Route path='/traineeupdate/:id' element={<UpdateTrainee/>}></Route>
        <Route path='/traineeschedule' element={<Schedule/>}></Route>
        <Route path='/traineeprogess' element={<Prograss/>}></Route>
        <Route path='/report' element={<Report/>}></Route>
        <Route path='/traineelogin' element={<Login/>}></Route>
       

        
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  )
}

export default App;
