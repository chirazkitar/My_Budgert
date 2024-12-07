import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timeout); // Clear timeout on unmount
  }, []);

  const db = getFirestore();
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [job, setJob] = useState("");

  const [editField, setEditField] = useState(""); // For tracking which field to edit
  const [tempValue, setTempValue] = useState(""); // For holding temporary input value

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not logged in!");
        navigate("/");
        return;
      }

      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username || "");
          setEmail(userData.email || "");
          setPassword(userData.password || "");
          setJob(userData.job || "");
        } else {
          alert("User not found!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, [db, navigate, userId]);

  const handleUpdate = async () => {
    try {
      const userDocRef = doc(db, "users", userId);
      const updateData = { [editField]: tempValue };
      await updateDoc(userDocRef, updateData);

      // Update local state
      if (editField === "username") setUsername(tempValue);
      if (editField === "email") setEmail(tempValue);
      if (editField === "password") setPassword(tempValue);
      if (editField === "job") setJob(tempValue);

      setTempValue("");
      setEditField("");
      alert("Update successful!");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <>
      <div>
        <SideBar />
        <div className="container">
          <h4>Profile</h4>
          <div>
            <h5>Personal Details</h5>
            {isLoading ? (
              <img src="src/assets/spinner.gif" alt="Loading" className="spinner" />
            ) : (
              [
                { label: "Username", value: username, field: "username" },
                { label: "Email", value: email, field: "email" },
                { label: "Password", value: password, field: "password" },
                { label: "Job", value: job, field: "job" },
              ].map(({ label, value, field }) => (
                <div key={field} className="profile-field">
                  <div className="profile-text">
                    <span className="profile-label">{label}: </span>
                    <span className="profile-value">
                      {value}
                      <img
                        src="src/assets/icons/pencil-square.svg"
                        data-bs-toggle="modal"
                        data-bs-target="#editModal"
                        alt="Edit"
                        className="profile-img"
                        onClick={() => {
                          setEditField(field);
                          setTempValue(value);
                        }}
                      />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">
                Edit {editField}
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
                  <label>New {editField}:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  />
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
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
