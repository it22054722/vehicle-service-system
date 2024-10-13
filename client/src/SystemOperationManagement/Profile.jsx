import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Swal from 'sweetalert2'; // Import SweetAlert2
import { FaUser, FaEnvelope, FaCar, FaEdit, FaTrashAlt, FaLock } from 'react-icons/fa'; // Import Font Awesome icons
import './Pages/styles/Profile.css'; // Import custom styles

const Profile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [packageDetails, setPackageDetails] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatedUsername, setUpdatedUsername] = useState('');
    const [updatedEmail, setUpdatedEmail] = useState('');
    const [updatedVehicleType, setUpdatedVehicleType] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [timeSpent, setTimeSpent] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);

    const getUserIdFromToken = (token) => {
        if (!token) return null;
        try {
            const payload = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payload));
            return decodedPayload.userId;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };


    const validateUsername = (username) => {
        const regex = /^[a-zA-Z][a-zA-Z0-9\s]*$/; // Must start with a letter, then allow letters, numbers, and spaces
        if (regex.test(username)) {
            setUpdatedUsername(username);
        } else {
            Swal.fire('Invalid Username!', 'Username must start with a letter and contain only letters, numbers, or spaces.', 'error');
        }
    };


    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@gmail\.com$/; // Must start with a letter and be a valid Gmail
        if (emailRegex.test(email)) {
            setUpdatedEmail(email);
        } else {
            Swal.fire('Invalid Email!', 'Email must start with a letter and follow the @gmail.com format.', 'error');
        }
    };
    
    

    const fetchUserProfile = async (userId) => {
        try {
            const token = localStorage.getItem('authToken');
            const userResponse = await axios.get(`http://localhost:3001/api/auth/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserProfile(userResponse.data);
            setUpdatedUsername(userResponse.data.username);
            setUpdatedEmail(userResponse.data.email);
            setUpdatedVehicleType(userResponse.data.vehicleType);

            // Fetch package details
            const packageResponse = await axios.get(`http://localhost:3001/api/bookings/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPackageDetails(packageResponse.data);
        } catch (error) {
            console.error('Error fetching profile data:', error);
            setError(error.response ? error.response.data.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userId = getUserIdFromToken(token);
        if (userId) {
            fetchUserProfile(userId);
        } else {
            setError('No token found. Please log in.');
            setLoading(false);
        }

        const interval = setInterval(() => {
            setTimeSpent(prevTime => prevTime + 1);
        }, 1000);
        setTimerInterval(interval);

        return () => clearInterval(interval);
    }, []);

    const handleDeleteAccount = async () => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (confirmDelete.isConfirmed) {
            try {
                const token = localStorage.getItem('authToken');
                const userId = getUserIdFromToken(token);
                await axios.delete(`http://localhost:3001/api/auth/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                localStorage.removeItem('authToken');

                Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
                setTimeout(() => window.location.href = '/login', 2000);
            } catch (error) {
                console.error('Error deleting account:', error);
                Swal.fire('Error!', error.response ? error.response.data.message : 'An error occurred', 'error');
            }
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('authToken');
            const userId = getUserIdFromToken(token);
            const formData = {
                username: updatedUsername,
                email: updatedEmail,
                vehicleType: updatedVehicleType,
            };

            await axios.put(`http://localhost:3001/api/auth/users/${userId}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Swal.fire('Success!', 'Profile updated successfully.', 'success');
            fetchUserProfile(userId); // Refresh user profile
            setIsEditing(false); // Exit edit mode after update
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire('Error!', error.response ? error.response.data.message : 'An error occurred', 'error');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('authToken');
            const userId = getUserIdFromToken(token);
            const formData = {
                oldPassword,
                newPassword,
            };

            await axios.put(`http://localhost:3001/api/auth/reset-password`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            Swal.fire('Success!', 'Password updated successfully.', 'success');
            setShowResetPassword(false); // Exit reset password mode after update
            setOldPassword('');
            setNewPassword('');
        } catch (error) {
            console.error('Error resetting password:', error);
            Swal.fire('Error!', error.response ? error.response.data.message : 'An error occurred', 'error');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card profile-card shadow-lg w-100" style={{ maxWidth: "1600px", backdropFilter: "blur(10px)", backgroundColor: "rgba(255, 255, 255, 0.8)" }}>
                {loading ? (
                    <div className="text-center my-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading profile...</p>
                    </div>
                ) : (
                    <>
                        {error && <p className="text-danger text-center">{error}</p>}
                        {userProfile ? (
                            <>
                                {isEditing ? (
                                   <form onSubmit={handleUpdateProfile}>
                                   <div className="form-group mb-3">
                                       <label>Username</label>
                                       <input
                                           type="text"
                                           className="form-control"
                                           value={updatedUsername}
                                           onChange={(e) => validateUsername(e.target.value)}
                                           required
                                       />
                                   </div>
                                   <div className="form-group mb-3">
                                       <label>Email</label>
                                       <input
                                           type="email"
                                           className="form-control"
                                           value={updatedEmail}
                                           onChange={(e) => validateEmail(e.target.value)}
                                           required
                                       />
                                   </div>
                                   <div className="form-group mb-3">
    <label>Vehicle Type</label>
    <select
        className="form-control"
        value={updatedVehicleType}
        onChange={(e) => setUpdatedVehicleType(e.target.value)}
        required
    >
        <option value="">Select Vehicle Type</option> {/* Default option */}
        <option value="Car">Car</option>
        <option value="Van">Van</option>
        <option value="SUV">SUV</option>
        <option value="Truck">Truck</option>
    </select>
</div>

                                   <div className="d-flex justify-content-between mt-4">
                                       <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                                       <button type="submit" className="btn btn-primary">Save Changes</button>
                                   </div>
                               </form>
                               
                                ) : (
                                    <>
                                        <h2 className="card-header text-center bg-primary text-white">User Profile</h2>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-4 mb-3">
                                                    <div className="card hover-effect" style={{ backgroundColor: 'rgba(255, 193, 7, 0.6)', height: '200px' }}>
                                                        <div className="card-body text-center">
                                                            <h5 className="card-title" style={{ fontSize: '1.5rem' }}><FaUser size={40} /></h5>
                                                            <p className="card-text">{userProfile.username}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <div className="card hover-effect" style={{ backgroundColor: 'rgba(0, 123, 255, 0.6)', height: '200px' }}>
                                                        <div className="card-body text-center">
                                                            <h5 className="card-title" style={{ fontSize: '1.5rem' }}><FaEnvelope size={40} /></h5>
                                                            <p className="card-text">{userProfile.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <div className="card hover-effect" style={{ backgroundColor: 'rgba(40, 167, 69, 0.6)', height: '200px' }}>
                                                        <div className="card-body text-center">
                                                            <h5 className="card-title" style={{ fontSize: '1.5rem' }}><FaCar size={40} /></h5>
                                                            <p className="card-text">{userProfile.vehicleType}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-center mt-2">
                                                <button className="btn btn-warning mx-2" onClick={() => setIsEditing(true)}><FaEdit /> Edit Profile</button>
                                                <button className="btn btn-danger mx-2" onClick={handleDeleteAccount}><FaTrashAlt /> Delete Account</button>
                                                <button className="btn btn-info mx-2" onClick={() => setShowResetPassword(true)}><FaLock /> Reset Password</button>
                                            </div>

                                            {showResetPassword && (
                                                <form onSubmit={handleResetPassword} className="mt-2">
                                                    <h5>Reset Password</h5>
                                                    <div className="form-group mb-3">
                                                        <label>Old Password</label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            value={oldPassword}
                                                            onChange={(e) => setOldPassword(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-group mb-3">
                                                        <label>New Password</label>
                                                        <input
                                                            type="password"
                                                            className="form-control"
                                                            value={newPassword}
                                                            onChange={(e) => setNewPassword(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="d-flex justify-content-between mt-4">
                                                        <button type="button" className="btn btn-secondary" onClick={() => setShowResetPassword(false)}>Cancel</button>
                                                        <button type="submit" className="btn btn-primary">Reset Password</button>
                                                    </div>
                                                </form>
                                            )}

                                            <div className="mt-4 text-center">
                                          
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <p className="text-danger text-center">User profile not found.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
