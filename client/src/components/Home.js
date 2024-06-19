import React from 'react'
import { Link } from 'react-router-dom';

function Home() {
    
  return (
    <>
      <div>Home</div>
      <Link to={'/login'}>
        <button>Login</button>
      </Link>
      <Link to={'/register'}>
        <button>Register</button>
      </Link>
    </>
  );
}

export default Home