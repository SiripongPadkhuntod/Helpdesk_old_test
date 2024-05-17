import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from '../components/auth/Signin';
import SignUp from '../components/auth/Signup';

const AuthPage = () => {
  return (
    <div>
      <h1>Authentication</h1>
      <Routes>
        <Route path="/auth/signin" element={<SignIn />} />
        <Route path="/auth/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
};

export default AuthPage;
