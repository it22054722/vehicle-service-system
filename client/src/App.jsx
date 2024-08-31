import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Services from './Services'
import CreateService from './CreateService'
import UpdateService from './UpdateService'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Services />}></Route>
        <Route path='/create' element={<CreateService />}></Route>
        <Route path='/update' element={<UpdateService />}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
