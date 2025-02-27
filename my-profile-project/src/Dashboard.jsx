import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // for navigation

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      // If there's no token, redirect to login page
      if (!token) {
        navigate("/");  // Redirect to login page
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
                    }`,
          }),
        });

        const data = await response.json();
        if (data.errors) {
          setError(data.errors[0].message);
        } else {
          setUserData(data.data.user[0]);
        }
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
      {/* Add more data as needed */}

        {/* Logout Button */}
        <button onClick={handleLogout} style={styles.button}>Logout</button>
    </div>
  );
};

const styles = {
  button: { padding: "10px", backgroundColor: "red", color: "white", border: "none", cursor: "pointer" },
};

export default Dashboard;
