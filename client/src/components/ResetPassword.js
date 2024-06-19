// src/components/ResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function ResetPassword() {
const navigate = useNavigate()

  const { id, token } = useParams();
  const [password, setPassword] = useState('');

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/reset-password/${id}/${token}`,
        { password }
      );
      console.log(response.data);
      alert("password changed Successfully")
      navigate('/login')
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="New Password"
        onChange={handleChange}
      />
      <button type="submit">Reset Password</button>
    </form>
  );
}

export default ResetPassword;
