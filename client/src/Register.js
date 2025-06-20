// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { username, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h3>Register</h3>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br />
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
