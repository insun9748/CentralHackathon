import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Onboarding  from './pages/Onboarding/Onboarding';
import Login from './pages/Onboarding/Login';
import Profile from './pages/Onboarding/Profile';
import Info from './pages/Onboarding/Info';
import Signup from './pages/Onboarding/Signup';

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
