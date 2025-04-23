import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // for navigation
import {  fetchLevel, fetchXP } from "./fetch_data";
import "./pico.css";
import "./Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [level, setLevel] = useState(null);
  const [xp, setXP] = useState(null);
  const [error, setError] = useState(null);
  const [skillMap, setSkillMap] = useState({});

  

  
  const navigate = useNavigate();
  useEffect(() => {
    if (error && (error.message.includes('unauthorized') || error.message.includes('token'))) {
      localStorage.removeItem('token');
      navigate('/'); // Redirect to login page if the error is related to authorization
    }
  }, [error, navigate]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if(!token) {
      console.log("No token found. Redirecting to login page.");
      navigate("/");  // Redirect to login page
    }
  }, [token, navigate]);
  useEffect(() => {
    console.log(skillMap);
  }, [skillMap])

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
                        profile
                        attrs
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
                }`,
          }),
        });

          // Check if the response is successful
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Data not found (404)");
        } else if (response.status === 401) {
          throw new Error("Unauthorized (401)");
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      }

        const data = await response.json();
        console.log('API Response:', data); // Add logging for API response
        if (data.errors) {
          setError(data.errors[0].message);
        } else {
          setUserData(data.data.user[0]);
          data.data.transaction.forEach(transaction => {
            if (transaction.type.includes("skill_")) {
              // Check if the transaction type is a skill type
              setSkillMap((prev) => ({...prev, [transaction.type]: transaction.amount}));
            }
          })
          
          // Only fetch level after userData is set and contains login
          if (data.data.user[0]?.login) {
            try {
              const levelData = await fetchLevel(data.data.user[0].login);
              setLevel(levelData || "Not available");
            } catch (levelError) {
              console.error("Error fetching level:", levelError);
              setLevel("Not available");
            }
          }
        }

        // Fetch skills and XP
        //const skillsData = await fetchSkills(token);
        const xpData = await fetchXP(token);

        // const skillMapping = {
        //   skill_prog: "Programming",
        //   skill_css: "CSS",
        //   skill_html: "HTML",
        //   skill_front_end: "Front-End",
        //   skill_go: "Go",
        //   skill_stats: "Statistics",
        //   skill_algo: "Algorithms",
        //   skill_back_end: "Back-End",
        //   skill_sql: "SQL",
        //   skill_docker: "Docker",
        //   skill_sys_admin: "System Administration",
        //   skill_js: "JavaScript",
        //   skill_game: "Game Development",
        //   skill_tcp: "TCP/IP",
        //   skill_unix: "Unix",
        // };

      
        setXP(xpData);

      } catch (error) {
        console.log("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    
    // Trigger storage event to notify App.js that authentication state changed
    window.dispatchEvent(new Event('storage'));
    
    // Clear the history to ensure that the user can't use browser back to return to dashboard
    window.history.replaceState(null, '', '/');
    
    // Navigate to login page, replace history
    navigate("/", { replace: true });
  };

  if (error) {
    if (error === "Data not found (404)") {
      return <div>404 Error: User data not found. Please check your request or try again later.</div>;
    } else if (error === "Unauthorized (401)") {
      return <div>Unauthorized Access: Please login to view your dashboard.</div>;
    } else {
      return <div>Error: {error}</div>;
    }
  }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

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
  
  return  (
    <main className="container">
    {/* User Info & Audit Statistics */}
    <div className="info-container">
      {/* User Info on the Left */}
      <article className="user-info">
        <h1>
          <span className="user-info-welcome">Welcome, {userData.firstName}!</span>
        </h1>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Campus:</strong> {userData.campus}</p>
        <p><strong>Username:</strong> {userData.login}</p>
        <p><strong>First Name:</strong> {userData.firstName}</p>
        <p><strong>Last Name:</strong> {userData.lastName}</p>
        <p>Gender: <span className="DataText">{userData.attrs.gender}</span></p>
        <p>Country of birth: <span className="DataText">{userData.attrs.countryOfBirth}</span></p>
        <p>Phone Number: <span className="DataText">{userData.attrs.Phone}</span></p>
        <p>CPR Number: <span className="DataText">{userData.attrs.CPRnumber}</span></p>
        <p>Qualification: <span className="DataText">{userData.attrs.qualification}</span></p>
        <p>Degree: <span className="DataText">{userData.attrs.Degree}</span></p>
        <p>Job: <span className="DataText">{userData.attrs.jobtitle}</span></p>
        </article>

    
      {/* Audit Statistics on the Right */}
      <article className="audit-stats">
        <h2>Audit</h2>
        <p><strong>Audit Ratio:</strong> {Math.ceil(userData.auditRatio * 10) / 10}</p>
        <div className="audit-graph">
          <svg width="400" height="300">
            {(() => {
              const maxValue = Math.max(userData.totalUp, userData.totalDown) || 1;
              const doneHeight = (userData.totalUp / maxValue) * 200;
              const receivedHeight = (userData.totalDown / maxValue) * 200;
              return (
                <>
                  {/* Done Bar */}
                  <rect x="80" y={250 - doneHeight} width="50" height={doneHeight} fill="#BEB8A7" rx="5" ry="5" />
                  <text x="105" y={250 - doneHeight - 10} textAnchor="middle" fontSize="14" fill="#BEB8A7">{formattedTotalUp}</text>
                  <text x="105" y="270" textAnchor="middle" fontSize="14" fill="#BEB8A7">Done</text>

                  {/* Received Bar */}
                  <rect x="250" y={250 - receivedHeight} width="50" height={receivedHeight} fill="#BEB8A7" rx="5" ry="5" />
                  <text x="275" y={250 - receivedHeight - 10} textAnchor="middle" fontSize="14" fill="#BEB8A7">{formattedTotalDown}</text>
                  <text x="275" y="270" textAnchor="middle" fontSize="14" fill="#BEB8A7">Received</text>
                </>
              );
            })()}
          </svg>
        </div>
         {/* Level & XP Below User Info */}
         <div className="level-xp">
          <article className="level">
            <h2>Level</h2>
            <svg width="140" height="140">
              <circle cx="70" cy="70" r="50" fill="#BEB8A7" stroke="#333" strokeWidth="5" />
              <text x="70" y="75" textAnchor="middle" fontSize="19" fill="#052940">{level}</text>
            </svg>
          </article>

          <article className="xp">
            <h2>XP</h2>
            <svg width="140" height="140">
              <circle cx="70" cy="70" r="50" fill="#BEB8A7" stroke="#333" strokeWidth="5" />
              <text x="70" y="75" textAnchor="middle" fontSize="19" fill="#052940">{formattedXP}</text>
            </svg>
          </article>
        </div>
      </article>

    </div>

   {/* Skills Chart */}
<article className="skills-chart">
  <h2>Skills Chart</h2>
  <div className="skills-graph">
    <svg width="100%" height="400">
      {Object.entries(skillMap).map(([skill, value], index) => (
        <g key={skill} transform={`translate(${index * 70}, 0)`}>
          {/* Skill % text ABOVE the bar */}
          <text x="35" y={280 - value * 3} textAnchor="middle" fontSize="16" fill="#BEB8A7" fontWeight="bold">
            {value}%
          </text>
          {/* Skill bar */}
          <rect x="15" y={300 - value * 3} width="40" height={value * 3} fill="#BEB8A7 " rx="5" ry="5" />
          {/* Bigger Skill name circle with Pico CSS color */}
          {/*<circle cx="35" cy="370" r="25" fill="#BEB8A7" stroke="var(--contrast)" strokeWidth="2" />*/}
          <text x="35" y="375" textAnchor="middle" fontSize="12" fill="#BEB8A7">
            {skill.replace("skill_", "").toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  </div>
</article>


    {/* Logout Button */}
    <button
      onClick={handleLogout}
      className="contrast"
      style={{ marginTop: "20px", padding: "10px 20px", borderRadius: "5px" }}
    >
      Logout
    </button>
  </main>
  );
}

export default Dashboard;