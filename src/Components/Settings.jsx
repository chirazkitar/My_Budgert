import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"; // Firestore imports

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);


  const db = getFirestore(); // Initialize Firestore
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" }); // e.g., "December 2024"

  // State variables
  const [budget, setBudget] = useState("");
  const [currentBudget, setCurrentBudget] = useState(null);

  // Firestore document reference
  const userDocRef = doc(db, "budgets", userId);

  // Fetch current month's budget when component mounts
  useEffect(() => {
    const fetchBudget = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not logged in!");
        navigate("/");
        return;
      }

      try {
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const budgets = userDoc.data().budgets || {};
          setCurrentBudget(budgets[currentMonth] || 0); // Set budget or default to 0
        } else {
          alert("User document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching budget:", error);
        alert("An error occurred while fetching your budget.");
      }
    };

    fetchBudget();
  }, [db, currentMonth, navigate, userDocRef]);

  // Update budget handler
  const handleUpdateBudget = async () => {
    if (!budget) {
      alert("Please enter a budget value.");
      return;
    }

    try {
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const budgets = userDoc.data().budgets || {};
        budgets[currentMonth] = parseFloat(budget);

        await updateDoc(userDocRef, { budgets });
        setCurrentBudget(budgets[currentMonth]);
        alert("Budget updated successfully!");
      } else {
        alert("User document does not exist.");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("An error occurred while updating your budget.");
    }
  };

  // Delete budget handler
  const handleDeleteBudget = async () => {
    try {
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const budgets = userDoc.data().budgets || {};
        budgets[currentMonth] = 0;

        await updateDoc(userDocRef, { budgets });
        setCurrentBudget(0);
        alert("Budget deleted successfully!");
      } else {
        alert("User document does not exist.");
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("An error occurred while deleting your budget.");
    }
  };

  return (
    <>
      <div>
        <SideBar />
        <div className="container">
          <h4>Settings</h4>
          <div>
            <h5>Current Budget</h5>
            {isLoading ? (
              <img src="src/assets/spinner.gif" alt="Loading" className="spinner" />
            ):(
            <div className="budget-settings">
              <p className="settings-text">
                Your budget for {currentMonth}: {currentBudget} DT
              </p>
              <div className="settings-img">
                <img
                  src="src/assets/icons/pencil-square.svg"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  alt="Edit"
                />
                <img
                  src="src/assets/icons/trash3-fill.svg"
                  onClick={handleDeleteBudget}
                  alt="Delete"
                />
              </div>
            </div>
            )}
          </div>
          <div>
            <h5>Theme</h5>
            <div className="checkbox-theme">
            <div className="form-check">
                <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" checked />
                <label className="form-check-label" for="exampleRadios1">
                Light theme
                </label>
                </div>
                <div className="form-check">
                <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2" />
                <label className="form-check-label" for="exampleRadios2">
                    Dark theme
                </label>
                </div>

              
            </div>
          </div>
          
        </div>
      
      </div>
    

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Change your budget
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label>Budget:</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">DT</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                data-bs-dismiss="modal"
                className="home-button"
                onClick={handleUpdateBudget}
              >
                Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
