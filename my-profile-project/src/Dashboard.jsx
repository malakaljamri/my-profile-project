import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // for navigation
import { fetchUserData, fetchSkills, fetchLevel, fetchXP } from "./fetch_data";
import "./pico.css";

import { UserSkills } from "./user_skills";


const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [level, setLevel] = useState(null);
  const [xp, setXP] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      // If there's no token, redirect to login page
      if (!token) {
        navigate("/login");  // Redirect to login page
      }

      try {
        const response = await fetch("https://learn.reboot01.com/api/graphql-engine/v1/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `query {
                      user {
                        id
                        login
                        firstName
                        lastName
                        email
                        campus
                      }
                      transaction {
                        amount
                        type
                      }
                    }`,
          }),
        });

        const data = await response.json();
        if (data.errors) {
          setError(data.errors[0].message);
        } else {
          setUserData(data.data.user[0]);
         // Extract transactions where type === "skill_prog"
        const skillTransactions = data.data.transaction
        .filter(trans => trans.type === "skill_prog")
        .map(trans => trans.amount); // Extract only the amount

      setSkills(skillTransactions);
        }
            // Fetch skills, level, and XP
            const skillsData = await fetchSkills(token);
            const levelData = await fetchLevel(token);
            const xpData = await fetchXP(token);

            setSkills(skillsData);
            setLevel(levelData);
            setXP(xpData);

      } catch (error) {
        console.log("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    // Remove token from localStorage and redirect to login page
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login page
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {userData.firstName}!</h1>
      <p>Email: {userData.email}</p>
      <p>Campus: {userData.campus}</p>
      <p>Username: {userData.login}</p>
      <p>First Name: {userData.firstName}</p>
      <p>Last Name: {userData.lastName}</p>

      <h2>Skills</h2>
      <div>
      <p>Skills: {skills.length > 0 ? skills.map(skill => skill.name).join(", ") : "No skills available"}</p>

      </div>

      <h2>Level</h2>             
      <div>
      <p>Level: {level || "Not available"}</p>
      </div>          

      <h2>XP</h2>
      <div>
      <p>XP: {xp || "Not available"}</p>
      </div>
      {/* Add more data as needed */}

        {/* Logout Button */}
        <button onClick={handleLogout} style={styles.button}>Logout</button>
    </div>
  );
};

const styles = {
  button: { 
    padding: "10px", 
    backgroundColor: "var(--primary)", 
    color: "var(--contrast)", 
    border: "none", 
    cursor: "pointer" 
  },
};


export default Dashboard;
