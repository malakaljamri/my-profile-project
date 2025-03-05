import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // for navigation
import { fetchUserData, fetchSkills, fetchLevel, fetchXP } from "./fetch_data";
import "./pico.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [level, setLevel] = useState(null);
  const [xp, setXP] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (error && (error.message.includes('unauthorized') || error.message.includes('token'))) {
      localStorage.removeItem('token');
      navigate('/'); // Redirect to login page if the error is related to authorization
    }
  }, [error, navigate]);

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
                        totalUp
                        totalDown
                        auditRatio
                      }
                      transaction {
                      id
                      amount
                      type
                      userId
                      createdAt
                      path
                      progress { id grade }
                    }
                    result { id grade userId createdAt isLast }

                     event_user(
                    where: {
                      userLogin: { _eq: "your_username" }
                      event: { path: { _eq: "/bahrain/bh-module" } }
                    }
                  ) {
                    level
                  }
                }`,
          }),
        });

        const data = await response.json();
        if (data.errors) {
          setError(data.errors[0].message);
        } else {
          setUserData(data.data.user[0]);
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

   // Ensure the formatted values are defined only when userData is available
   const formattedTotalUp = formatBytes(userData.totalUp || 0);
   const formattedTotalDown = formatBytes(userData.totalDown || 0);
   const formattedXP = formatBytes(xp || 0);

   function formatBytes(bytes, precision = 2) {
    let units = ["B", "kB", "MB", "GB", "TB"];
  
    if (bytes === 0) return "0 B";
  
    let exponent = Math.floor(Math.log(bytes) / Math.log(1000));
    let value = (bytes / Math.pow(1000, exponent)).toFixed(precision);
  
    return `${value} ${units[exponent]}`;
  }
 

  return (
    <div>
      <h1>Welcome, {userData.firstName}!</h1>
      <p>Email: {userData.email}</p>
      <p>Campus: {userData.campus}</p>
      <p>Username: {userData.login}</p>
      <p>Audit Ratio: {userData.auditRatio.toFixed(2)}</p>

      <h2>Skills</h2>
      <p>Skills: {skills.length > 0 ? skills.map(skill => skill.name).join(", ") : "No skills available"}</p>

      <h2>Level</h2>
      <p>Level: {level || "Not available"}</p>

      <h2>XP</h2>
      <p>XP: {formattedXP}</p>

      <h2>Statistics</h2>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width="400" height="200">
          {/* Bar for Total Up */}
          <rect x="50" y="50" width="100" height={userData.totalUp / 20000} fill="blue" />
          <text x="100" y="45" textAnchor="middle" fontSize="14" fill="black">
            {formattedTotalUp}
          </text>

          {/* Bar for Total Down */}
          <rect x="200" y="50" width="100" height={userData.totalDown / 20000} fill="red" />
          <text x="250" y="45" textAnchor="middle" fontSize="14" fill="black">
            {formattedTotalDown}
          </text>

          {/* Labels */}
          <text x="100" y="180" textAnchor="middle" fontSize="16" fill="blue">
            Done
          </text>
          <text x="250" y="180" textAnchor="middle" fontSize="16" fill="red">
            Recived
          </text>
        </svg>
      </div>

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