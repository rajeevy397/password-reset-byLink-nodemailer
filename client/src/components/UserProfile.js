// src/components/UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate()

  const handleLogout = ()=>{
    localStorage.clear()
    navigate("/login")
  }

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post('http://localhost:5000/userData', {
          token,
        });
        setUser(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>User Profile</h1>
      <p>First Name: {user.fname}</p>
      <p>Last Name: {user.lname}</p>
      <p>Email: {user.email}</p>
      <p>User Type: {user.userType}</p>
      <button onClick={handleLogout}>LogOut</button>
    </div>
  );
}

export default UserProfile;
