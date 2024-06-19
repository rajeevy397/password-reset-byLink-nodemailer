// src/components/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/forgot-password',
        { email }
      );
      console.log(response.data);
      alert("Password Reset Link sent SuccessFully! Please check your email")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default ForgotPassword;
