import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './ExpensesForm.css'; // Import the CSS for styling

const ExpensesForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState(['Food', 'Transport', 'Entertainment']);

  const navigate = useNavigate(); // useNavigate replaces useHistory in v6

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the form data (e.g., submit it to an API or state)
    console.log({ title, description, note, category });
  };

  // Redirect to "Add Category" page
  const goToAddCategory = () => {
    navigate('/add-category'); // Replace history.push with navigate in v6
  };

  return (
    <div className="expenses-form-container">
      {/* Title placed outside the form */}
      <h2>Expenses Form</h2>
      
      {/* The form itself */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="note">Note:</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <div className="select-wrapper">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {/* Add Category Button below the select box */}
            <button
              type="button"
              className="add-category-btn"
              onClick={goToAddCategory}
            >
              <i className="fas fa-plus-circle"></i> Add Category
            </button>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ExpensesForm;