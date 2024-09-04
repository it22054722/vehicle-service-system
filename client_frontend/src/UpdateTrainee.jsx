import React,{useState,useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios'


function UpdateTrainee (){

  const {id} = useParams()
  const[trainee_id, setID] = useState()
  const[name, setName] = useState()
  const[age, setAge] = useState()
  const[trainee_periode, setTperiode] = useState()
  const[email, setEmail] = useState()
  const[phone_number, setPnumber] = useState()
  const navigate = useNavigate()


  useEffect(() =>{
    axios.get('http://localhost:3001/getTrainee/'+id)
    .then(result =>{console.log(result)
      setID(result.data.trainee_id)
      setName(result.data.name)
      setAge(result.data.age)
      setTperiode(result.data.trainee_periode)
      setEmail(result.data.email)
      setPnumber(result.data.phone_number)
    })
    .catch(err => console.log(err))
  
  },[]);

const Update = (e) =>{
  e.preventDefault();
  axios.put("http://localhost:3001/updateTrainee/"+id, {trainee_id,name,age,trainee_periode,email,phone_number})
  .then(result => {
    console.log(result)
    navigate('/')
  })
  .catch(err => console.log(err))

}

   return( 
    <div className="d-flex justify-content-center align-items-center vh-100 bg-primary">
    <div className="card p-4 shadow" style={{ width: '400px', borderRadius: '20px' }}>
      <form   onSubmit={Update}>
        
<h2>Update Trainee</h2>
        <div className="mb-3">
          <label htmlFor="Trainee_id" className="form-label">Trainee ID</label>
          <input
            type="text"
            className="form-control"
            id="Trainee_id"
            placeholder="Enter ID"
            autoComplete='off'
            value={trainee_id}
            onChange ={(e) => setID(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="Name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="Name"
            placeholder="Enter Name"
            autoComplete='off'
            value={name}
            onChange ={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="Age" className="form-label">Age</label>
          <input
            type="text"
            className="form-control"
            id="Age"
            placeholder="Enter Age"
            autoComplete='off'
            value={age}
            onChange ={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Trainee_Periode" className="form-label">Trainee Periode</label>
          <input
            type="text"
            className="form-control"
            id="Trainee_Periode"
            placeholder="Enter periode"
            autoComplete='off'
            value={trainee_periode}
            onChange ={(e) => setTperiode(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter Email"
            autoComplete='off'
            value={email}
            onChange ={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="Phone" className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            id="Phone"
            placeholder="Enter Phone number"
            autoComplete='off'
            value={phone_number}
            onChange ={(e) => setPnumber(e.target.value)}
          />
        </div >
      <div align="center">
        <button type="update" className="btn btn-sm btn-success w-20">Update</button>
        
        </div>
      </form>
    </div>
  </div>
   )
}

export default UpdateTrainee;