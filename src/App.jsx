import { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";

import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./Components/SignUp";
import Login from './Components/LogIn';

function App() {


  return (
    <Router>
    <Routes>
      {/* Default Route: Sign Up */}
      <Route path="/" element={<SignUp />} />
      <Route path="/Login" element={<Login />} />

    </Routes>
  </Router>
  )
}

export default App
