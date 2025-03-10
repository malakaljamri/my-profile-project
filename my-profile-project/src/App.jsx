import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login";  // Import Login component
import Dashboard from "./Dashboard";  // Import Dashboard component
import NotFound from "./NotFound"; // The 404 page


const App = () => {
  const [, setIsAuthenticated] = useState(false);

  // Check if the user is authenticated (e.g., check if token is present)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Conditional Rendering: Show login or dashboard based on authentication */}
          <Route path="/" element= {<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
