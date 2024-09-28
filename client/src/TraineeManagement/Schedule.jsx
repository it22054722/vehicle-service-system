import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [trainees, setTrainees] = useState([]);
  const [date, setDate] = useState('');
  const [timeSlot1, setTimeSlot1] = useState('8:00 - 11:00');
  const [timeSlot2, setTimeSlot2] = useState('8:00 - 11:00');
  const [timeSlot3, setTimeSlot3] = useState('8:00 - 11:00');
  const [availability1, setAvailability1] = useState('Available');
  const [availability2, setAvailability2] = useState('Available');
  const [availability3, setAvailability3] = useState('Available');
  const [task, setTask] = useState('');
  const [traineeId, setTraineeId] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [unavailableSlots, setUnavailableSlots] = useState([]);

  const navigate = useNavigate();

  // Fetch trainees and schedules on component mount
  useEffect(() => {
    axios.get('http://localhost:3001/trainees')
      .then((res) => setTrainees(res.data))
      .catch((err) => console.log(err));

    axios.get('http://localhost:3001/schedules')
      .then((res) => setSchedules(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Basic validation checks
  const validateForm = () => {
    if (!date) {
      alert('All fields are reduired!.');
      return false;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert('Please select a future date.');
      return false;
    }

    if (!traineeId) {
      alert('Please select a trainee.');
      return false;
    }

    if (!task) {
      alert('Please enter a task.');
      return false;
    }

    return true;
  };

  const handleFill = () => {
    // Check validation before processing
    if (!validateForm()) return;

    // Check if the trainee is already scheduled for the selected date
    const existingScheduleForTrainee = schedules.find(
      (schedule) => schedule.date === date && schedule.trainee_id._id === traineeId
    );
    
    if (existingScheduleForTrainee) {
      alert('This trainee already has a schedule for this day.');
      return;
    }

    // Check if any time slots are already taken
    const existingSchedule = schedules.filter(schedule => schedule.date === date);

    for (const schedule of existingSchedule) {
      if (
        (schedule.timeSlot1 === timeSlot1 && schedule.availability1 === 'Unavailable') ||
        (schedule.timeSlot2 === timeSlot2 && schedule.availability2 === 'Unavailable') ||
        (schedule.timeSlot3 === timeSlot3 && schedule.availability3 === 'Unavailable')
      ) {
        alert('One or more selected time slots are already unavailable.');
        return;
      }
    }

    const newSchedule = {
      date,
      timeSlot1,
      availability1,
      timeSlot2,
      availability2,
      timeSlot3,
      availability3,
      task,
      trainee_id: traineeId
    };

    axios.post('http://localhost:3001/createSchedule', newSchedule)
      .then((res) => {
        setSchedules([...schedules, res.data]);
        setDate('');
        setTimeSlot1('8:00 - 11:00');
        setTimeSlot2('8:00 - 11:00');
        setTimeSlot3('8:00 - 11:00');
        setAvailability1('Available');
        setAvailability2('Available');
        setAvailability3('Available');
        setTask('');
        setTraineeId('');
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/deleteSchedule/${id}`)
      .then(() => setSchedules(schedules.filter(schedule => schedule._id !== id)))
      .catch((err) => console.log(err));
  };

  const handleFilter = () => {
    if (!filterDate) {
      alert('Please select a date to filter.');
      return;
    }

    const unavailable = schedules
      .filter(schedule => schedule.date === filterDate)
      .map(schedule => {
        const unavailableSlots = [];
        if (schedule.availability1 === 'Unavailable') unavailableSlots.push('Time Slot 1: ' + schedule.timeSlot1);
        if (schedule.availability2 === 'Unavailable') unavailableSlots.push('Time Slot 2: ' + schedule.timeSlot2);
        if (schedule.availability3 === 'Unavailable') unavailableSlots.push('Time Slot 3: ' + schedule.timeSlot3);
        return unavailableSlots;
      })
      .flat();

    setUnavailableSlots(unavailable.length > 0 ? unavailable : ['All time slots are available.']);
  };

  return (
    <div className="background d-flex vh-100 justify-content-center align-items-center">
    
      <div className="w-75  rounded p-4 shadow-lg"style={{  backgroundColor: 'rgba(255, 255, 255, 0.8)' }}> 
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '45px',fontSize: '2.5rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>Schedule Management</h2>
          
          {/* Form Section */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label ">Date</label>
              <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Trainee</label>
              <select className="form-select" value={traineeId} onChange={(e) => setTraineeId(e.target.value)}>
                <option value="">Select Trainee</option>
                {trainees.map((trainee) => (
                  <option key={trainee._id} value={trainee._id}>
                    {trainee.trainee_id} - {trainee.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            {[1, 2, 3].map((slot) => (
              <div className="col-md-4 mb-3" key={slot}>
                <label className="form-label">Time Slot {slot}</label>
                <select className="form-select" value={eval(`timeSlot${slot}`)} onChange={(e) => eval(`setTimeSlot${slot}(e.target.value)`)} >
                  <option value="8:00 - 11:00">8:00 - 11:00</option>
                  <option value="11:00 - 1:30">11:00 - 1:30</option>
                  <option value="2:30 - 5:30">2:30 - 5:30</option>
                </select>
                <select className="form-select mt-2" value={eval(`availability${slot}`)} onChange={(e) => eval(`setAvailability${slot}(e.target.value)`)} >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label">Task</label>
            <input type="text" className="form-control" value={task} onChange={(e) => setTask(e.target.value)} />
          </div>

          <button className="btn  w-100 mb-4"style={{
              backgroundColor: "#8B0000", // Dark red color
              color: "#fff",
            }} onClick={handleFill}>Create Schedule</button>

          {/* Filter Section */}
          <h4 className="mb-3"style={{color: "#8B0000"}}>Filter Unavailable Time Slots</h4>
          
          <div className="mb-3">
            <label className="form-label">Filter by Date</label>
            <div className="input-group">
              <input type="date" className="form-control" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              <button className="btn btn-outline-secondary" onClick={handleFilter}>Filter</button>
            </div>
          </div>

          <ul className="list-group mb-4">
            {unavailableSlots.map((slot, index) => (
              <li className="list-group-item" key={index}>{slot}</li>
            ))}
          </ul>

          {/* Schedules Table */}
          <h4 className="mb-3"style={{color: "#8B0000"}}>Schedules</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time Slot 1</th>
                <th>Availability 1</th>
                <th>Time Slot 2</th>
                <th>Availability 2</th>
                <th>Time Slot 3</th>
                <th>Availability 3</th>
                <th>Task</th>
                <th>Trainee ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr key={schedule._id}>
                  <td>{schedule.date}</td>
                  <td>{schedule.timeSlot1}</td>
                  <td>{schedule.availability1}</td>
                  <td>{schedule.timeSlot2}</td>
                  <td>{schedule.availability2}</td>
                  <td>{schedule.timeSlot3}</td>
                  <td>{schedule.availability3}</td>
                  <td>{schedule.task}</td>
                  <td>{schedule.trainee_id ? schedule.trainee_id.trainee_id : 'N/A'}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(schedule._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Back Button */}
          <button className="btn btn-secondary w-20 mt-4" onClick={() => navigate('/traineedashboard')}>Back to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

export default Schedule;
