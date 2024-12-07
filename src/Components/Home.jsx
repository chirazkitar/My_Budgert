import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { getFirestore, doc, getDoc, updateDoc,setDoc } from "firebase/firestore"; // Firestore imports

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const db = getFirestore(); // Initialize Firestore
  const navigate = useNavigate();

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  }); // e.g., "November 2024"

  const [budget, setBudget] = useState("");
  const [currentBudget, setCurrentBudget] = useState(null); // Track the current month's budget

  useEffect(() => {
    // Fetch the budget for the current month when the component loads
    const fetchBudget = async () => {
      const token = localStorage.getItem("token"); // Retrieve user ID (assumes it's stored during login)
      if (!token) {
        alert("User not logged in!");
        navigate("/");
        return;
      }
      const userId = localStorage.getItem("userId");
      console.log("Retrieved userId:", userId); // Debugging


      const userDocRef = doc(db, "budgets", userId);
      console.log("Firestore Document Path: budgets/" + userId); // Debugging
      
  try {
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const budgets = userDoc.data().budgets || {};
      setCurrentBudget(budgets[currentMonth] || 0);
    } else {
      console.log("User document does not exist. Creating it...");
      // Initialize with an empty structure
      await setDoc(userDocRef, { budgets: {} });
      setCurrentBudget(0);
      if (currentBudget === 0) {
        alert("Document created. You can now add budget information.");
      }    }
  } catch (error) {
    console.error("Error fetching user document:", error);
  }
    };

    fetchBudget();
  }, [db, currentMonth, navigate]);

  const handleSaveBudget = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not logged in!");
        return;
      }
      const userId = localStorage.getItem("userId");

      const userDocRef = doc(db, "budgets", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const budgets = userDoc.data().budgets || {};
        budgets[currentMonth] = parseFloat(budget || "0.00"); // Update the budget for the current month
        await updateDoc(userDocRef, { budgets });

        setCurrentBudget(budgets[currentMonth]); // Update state with the new budget
        alert("Budget updated successfully!");
      } else {
        alert("User Document does not exist");
      }
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("Error saving budget: " + error.message);
    }
  };

  const expenses = [
    {
      icon: "src/assets/icons/shop.svg",
      category: "Shopping",
      amount: "$544",
      date: "10 Jan 2022",
      title: "Clothes",
    },
    {
      icon: "src/assets/icons/egg-fried.svg",
      category: "Restaurant",
      amount: "$54,417.80",
      date: "11 Jan 2022",
      title: "Lunch with friends",
    },
    {
      icon: "src/assets/icons/car-front.svg",
      category: "Transport",
      amount: "$54.00",
      date: "12 Jan 2022",
      title: "Uber to work",
    },
  ];

  return (
    <>
      <div>
        <SideBar />
        <div className="container">
          <h4 className="home-header">Home</h4>
          {isLoading ? (
            <img src="src/assets/spinner.gif" alt="Loading" className="spinner" />
          ) : currentBudget === 0 ? (
            // Display the "Add Budget" section if the budget is 0
            <div className="content-1">
              <div className="budget-container-1">
                <h6>28 November 2024</h6>
                <div className="home-text-1">
                  {currentBudget} DT
                  <span>Your current budget </span>
                </div>
                <div className="budget-container-1-2">
                  <div className="home-text-2-1">
                    <div className="icon-container">
                      <img
                        src="src/assets/icons/graph-up-arrow (1).svg"
                        alt="up-arrow"
                      />
                      {currentBudget} DT
                    </div>
                    <span>Your starting budget </span>
                  </div>
                  <div className="home-text-2-2">
                    <div className="icon-container">
                      <img
                        src="src/assets/icons/graph-down-arrow.svg"
                        alt="down-arrow"
                      />
                      {currentBudget} DT
                    </div>
                    <span>Your expenses </span>
                  </div>
                </div>
              </div>
              
              
             
               {/* Render the message and button only when currentBudget is 0 */}
                {currentBudget === 0 && (
                  <div>
                    <p className="home-text">
                      Having trouble managing your budget? Let us help you.
                    </p>
                    <button
                      className="home-button"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      Add Budget
                    </button>
                  </div>
                )}
              </div>
          ) : (
            // Display the budget if it exists and is greater than 0
            <div className="content-2">
              <div className="budget-container-1">
                <h6>28 November 2024</h6>
                <div className="home-text-1">
                  {currentBudget} DT
                  <span>Your current budget </span>
                </div>
                <div className="budget-container-1-2">
                  <div className="home-text-2-1">
                    <div className="icon-container">
                      <img
                        src="src/assets/icons/graph-up-arrow (1).svg"
                        alt="up-arrow"
                      />
                      {currentBudget} DT
                    </div>
                    <span>Your starting budget </span>
                  </div>
                  <div className="home-text-2-2">
                    <div className="icon-container">
                      <img
                        src="src/assets/icons/graph-down-arrow.svg"
                        alt="down-arrow"
                      />
                      {currentBudget} DT
                    </div>
                    <span>Your expenses </span>
                  </div>
                </div>
              </div>
              <div className="section-expenses">
                <div className="header-container">
                  <h6 className="expenses-header">Your Expenses </h6>
                  <img
                    src="src/assets/icons/plus-square.svg"
                    alt="add-icon"
                  />
                </div>
                <div className="expense-container">
                  {expenses.map((expense, index) => (
                    <div
                      key={index}
                      className={`expense-row ${expense.category.toLowerCase()}`}
                    >
                      <div
                        className={`expense-icon ${
                          expense.category === "Shopping"
                            ? "icon-shopping"
                            : expense.category === "Restaurant"
                            ? "icon-restaurant"
                            : "icon-transport"
                        }`}
                      >
                        <img src={`${expense.icon}`} alt={expense.category} />
                      </div>
                      <div className="expense-details">
                        <h4>{expense.title}</h4>
                        <p>{expense.date}</p>
                      </div>
                      <div className="expense-amount">
                        <h4>{expense.amount}</h4>
                        <p>{expense.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
                Add your budget
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
                      aria-label="Amount (to the nearest dollar)"
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
                onClick={handleSaveBudget}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
