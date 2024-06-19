// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: '',
    userType: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/register',
        formData
      );
      console.log(response.data);
      alert("User Registered Successfully!")
      navigate('/login')
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="fname"
        placeholder="First Name"
        onChange={handleChange}
      />
      <input
        type="text"
        name="lname"
        placeholder="Last Name"
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <input
        type="text"
        name="userType"
        placeholder="User Type"
        onChange={handleChange}
      />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
