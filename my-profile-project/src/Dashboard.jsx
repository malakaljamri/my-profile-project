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
  const [skillMap, setSkillMap] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (error && (error.message.includes('unauthorized') || error.message.includes('token'))) {
      localStorage.removeItem('token');
      navigate('/'); // Redirect to login page if the error is related to authorization
    }
  }, [error, navigate]);

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
                      userLogin: { _eq: "${userData?.login}" }
                      event: { path: { _eq: "/bahrain/bh-module" } }
                    }
                  ) {
                    level
                  }
                }`,
          }),
        });

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
        }

        // Fetch skills, level, and XP
        const skillsData = await fetchSkills(token);
        const levelData = await fetchLevel(userData?.login); // Pass the correct username
        const xpData = await fetchXP(token);

        const skillMapping = {
          skill_prog: "Programming",
          skill_css: "CSS",
          skill_html: "HTML",
          skill_front_end: "Front-End",
          skill_go: "Go",
          skill_stats: "Statistics",
          skill_algo: "Algorithms",
          skill_back_end: "Back-End",
          skill_sql: "SQL",
          skill_docker: "Docker",
          skill_sys_admin: "System Administration",
          skill_js: "JavaScript",
          skill_game: "Game Development",
          skill_tcp: "TCP/IP",
          skill_unix: "Unix",
        };

        setSkills(skillsData.map(skill => (skillMapping[skill.type] || skill.type).toUpperCase()));
        setLevel(levelData || "Not available");
        setXP(xpData);

      } catch (error) {
        console.log("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, [navigate, userData]);

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
    <main className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '20px', width: '100%' }}>
      <article style={{ boxShadow: '0 4px 8px #BEB8A7', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <h1>
          <span style={{ color: '#BEB8A7' }}>Welcome, {userData.firstName}!</span>
        </h1>
      </article>
  
      <article style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Campus:</strong> {userData.campus}</p>
        <p><strong>Username:</strong> {userData.login}</p>
        <p><strong>First Name:</strong> {userData.firstName}</p>
        <p><strong>Last Name:</strong> {userData.lastName}</p>
      </article>

        {/* Statistics */}
        <article style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '10px', width: '48%' }}>
        <h2>Statistics</h2>
        <p><strong>Audit Ratio:</strong> {userData.auditRatio.toFixed(2)}</p>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <svg width="400" height="300">
            {(() => {
              const maxValue = Math.max(userData.totalUp, userData.totalDown) || 1;
              const doneHeight = (userData.totalUp / maxValue) * 200;
              const receivedHeight = (userData.totalDown / maxValue) * 200;
              return (
                <>
                  {/* Done Bar */}
                  <rect
                    x="80"
                    y={250 - doneHeight}
                    width="50"
                    height={doneHeight}
                    fill="#BEB8A7"
                    rx="5"
                    ry="5"
                  />
                  <text
                    x="105"
                    y={250 - doneHeight - 10}
                    textAnchor="middle"
                    fontSize="14"
                    fill="#BEB8A7"
                  >
                    {formattedTotalUp}
                  </text>
                  <text
                    x="105"
                    y="270"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#BEB8A7"
                  >
                    Done
                  </text>

                  {/* Received Bar */}
                  <rect
                    x="250"
                    y={250 - receivedHeight}
                    width="50"
                    height={receivedHeight}
                    fill="#BEB8A7"
                    rx="5"
                    ry="5"
                  />
                  <text
                    x="275"
                    y={250 - receivedHeight - 10}
                    textAnchor="middle"
                    fontSize="14"
                    fill="#BEB8A7"
                  >
                    {formattedTotalDown}
                  </text>
                  <text
                    x="275"
                    y="270"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#BEB8A7"
                  >
                    Received
                  </text>
                </>
              );
            })()}
          </svg>
        </div>
      </article>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', width: '100%' }}>
        <article style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '10px', width: '48%' }}>
          <h2>Level</h2>
          <svg width="200" height="200">
            <circle cx="100" cy="100" r="50" fill="#F5A390" stroke="#333" strokeWidth="3" />
            <text x="100" y="100" textAnchor="middle" fontSize="20" fill="#fff" dy=".3em">
              Level {level}
            </text>
          </svg>
        </article>
  
        <article style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '10px', width: '48%' }}>
          <h2>XP</h2>
          <svg width="200" height="200">
            <circle cx="100" cy="100" r="50" fill="#748BF8" stroke="#333" strokeWidth="3" />
            <text x="100" y="100" textAnchor="middle" fontSize="20" fill="#fff" dy=".3em">
              XP {formattedXP}
            </text>
          </svg>
        </article>
      </div>

  
      <article style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '10px', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Skills Chart</h2>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
          <svg width="100%" height="400">
            {Object.entries(skillMap).map(([skill, value], index) => (
              <g key={skill} transform={`translate(${index * 60}, 0)`}>
                <rect x="10" y={300 - value * 3} width="40" height={value * 3} fill="#BEB8A7" rx="5" ry="5" />
                <text x="30" y={300 - value * 3 + 20} textAnchor="middle" fontSize="14" fill="#fff">
                  {value}%
                </text>
                <circle cx="30" cy="350" r="20" fill="#fff" stroke="#4CAF50" strokeWidth="2" />
                <text x="30" y="355" textAnchor="middle" fontSize="10" fill="#333">
                  {skill.replace('skill_', '').toUpperCase()}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </article>
  
      <button onClick={handleLogout} className="contrast" style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '5px' }}>
        Logout
      </button>
    </main>
  );
}
  
  export default Dashboard;
  