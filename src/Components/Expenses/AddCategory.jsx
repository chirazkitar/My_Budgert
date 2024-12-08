import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import './AddCategory.css';

const AddCategory = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState('');
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    // Add the new category to the categories list
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      // Optionally, you can redirect after adding the category
      navigate('/expenses-form'); // Redirects back to the Expenses form page
    } else {
      alert('Please provide a valid category name.');
    }
  };

  return (
    <div>
      <h2>Add a New Category</h2>
      <form onSubmit={handleCategorySubmit}>
        <div>
          <label htmlFor="newCategory">New Category:</label>
          <input
            type="text"
            id="newCategory"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
