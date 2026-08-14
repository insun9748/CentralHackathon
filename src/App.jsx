import { useState } from 'react'
<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Onboarding  from './pages/Onboarding/Onboarding';
import Login from './pages/Onboarding/Login';
import Profile from './pages/Onboarding/Profile';
import Info from './pages/Onboarding/Info';
import Signup from './pages/Onboarding/Signup';
=======

>>>>>>> 28985bba81845ad76a474ec93603f228c0ed56c3

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/info" element={<Info />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App
