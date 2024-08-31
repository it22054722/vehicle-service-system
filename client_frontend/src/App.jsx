import { useState } from 'react'
import './App.css'
import{BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import CreateTrainee from './CreateTrainee'
import UpdateTrainee from './UpdateTrainee'
import Trainees from './trainees'



function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Trainees/>}></Route>
        <Route path='/create' element={<CreateTrainee/>}></Route>
        <Route path='/update' element={<UpdateTrainee/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
