import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Import SweetAlert2

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
      alert('All fields are required!');
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
    // Show confirmation dialog before deleting
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:3001/deleteSchedule/${id}`)
          .then(() => setSchedules(schedules.filter(schedule => schedule._id !== id)))
          .catch((err) => console.log(err));

        Swal.fire(
          'Deleted!',
          'Your schedule has been deleted.',
          'success'
        );
      }
    });
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
      <div className="w-75 rounded p-2 shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', fontSize: '12px', marginTop: "60px" }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', marginTop: '10px', fontSize: '1.5rem', fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)' }}>Schedule Management</h2>
          
          {/* Form Section */}
          <div className="row mb-1">
            <div className="col-6 mb-1">
              <label className="form-label" style={{ fontSize: '12px' }}>Date</label>
              <input type="date" className="form-control form-control-sm" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="col-6 mb-1">
              <label className="form-label" style={{ fontSize: '12px' }}>Trainee</label>
              <select className="form-select form-select-sm" value={traineeId} onChange={(e) => setTraineeId(e.target.value)}>
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
              <div className="col-4 mb-1" key={slot}>
                <label className="form-label" style={{ fontSize: '12px' }}>Time Slot {slot}</label>
                <select className="form-select form-select-sm" value={eval(`timeSlot${slot}`)} onChange={(e) => eval(`setTimeSlot${slot}(e.target.value)`)} >
                  <option value="8:00 - 11:00">8:00 - 11:00</option>
                  <option value="11:00 - 1:30">11:00 - 1:30</option>
                  <option value="2:30 - 5:30">2:30 - 5:30</option>
                </select>
                <select className="form-select form-select-sm mt-1" value={eval(`availability${slot}`)} onChange={(e) => eval(`setAvailability${slot}(e.target.value)`)} >
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </div>
            ))}
          </div>

          <div className="mb-1">
            <label className="form-label" style={{ fontSize: '12px' }}>Task</label>
            <input type="text" className="form-control form-control-sm" value={task} onChange={(e) => setTask(e.target.value)} />
          </div>
<br></br>
          <button className="btn w-100 mb-2 btn-sm" style={{ backgroundColor: "#8B0000", color: "#fff", fontSize: '12px' }} onClick={handleFill}>Create Schedule</button>
        </div>

        
        {/* Filter Section */}
        <h3 className="mb-1" style={{ color: "#8B0000", fontSize: '14px' }}>Filter Unavailable Time Slots</h3>
          <div className="mb-1">
            <label className="form-label" style={{ fontSize: '12px' }}>Filter by Date</label>
            <div className="input-group input-group-sm">
              <input type="date" className="form-control" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
              <button className="btn btn-outline-dark btn-sm" style={{ fontSize: '12px' }} onClick={handleFilter}>Filter</button>
            </div>
          </div>
          <ul className="list-group mb-2" style={{ fontSize: '12px' }}>
            {unavailableSlots.map((slot, index) => (
              <li key={index} className="list-group-item p-1">{slot}</li>
            ))}
          </ul>

        {/* Schedules Section */}
        <h4 className="mb-1" style={{ color: "#8B0000", fontSize: '14px' }}>Schedules</h4>
          <div className="table-responsive">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Trainee</th>
                  <th>Time Slot 1</th>
                  <th>Availability 1</th>
                  <th>Time Slot 2</th>
                  <th>Availability 2</th>
                  <th>Time Slot 3</th>
                  <th>Availability 3</th>
                  <th>Task</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule._id}>
                    <td>{schedule.date}</td>
                    <td>{schedule.trainee_id.trainee_id}</td>
                    <td>{schedule.timeSlot1}</td>
                    <td>{schedule.availability1}</td>
                    <td>{schedule.timeSlot2}</td>
                    <td>{schedule.availability2}</td>
                    <td>{schedule.timeSlot3}</td>
                    <td>{schedule.availability3}</td>
                    <td>{schedule.task}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(schedule._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
           {/* Back Button */}
    <button className="btn btn-secondary btn-sm w-20 mt-2" onClick={() => navigate('/traineedashboard')}>Back to Dashboard</button>
        </div>

      </div>
    </div>
  );
}

export default Schedule;
