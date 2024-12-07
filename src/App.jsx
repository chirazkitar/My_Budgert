import { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./Components/SignUp";
import Login from './Components/LogIn';
import ExpensesForm from './Components/Expenses/ExpensesForm';
import AddCategory from './Components/Expenses/AddCategory';

function App() {
  const [categories, setCategories] = useState(['Food', 'Transport', 'Entertainment']);


  return (
    <Router>
    <Routes>
      {/* Default Route: Sign Up */}
      <Route path="/" element={<SignUp />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/expenses-form" element={<ExpensesForm categories={categories} setCategories={setCategories} />} />
      <Route path="/add-category" element={<AddCategory categories={categories} setCategories={setCategories} />} />
    </Routes>
  </Router>
  )
}

export default App
