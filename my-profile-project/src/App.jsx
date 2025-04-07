import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./login";  // Import Login component
import Dashboard from "./Dashboard";  // Import Dashboard component
import NotFound from "./NotFound"; // The 404 page
import usePreventBackNavigation from "./hooks/usePreventBackNavigation"; // Import the custom hook


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if the user is authenticated (e.g., check if token is present)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
      setIsCheckingAuth(false);
    };
    
    checkAuth();
    
    // Listen for storage events (e.g., when token is removed by logging out)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* If already authenticated, redirect to dashboard */}
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          {/* If not authenticated, redirect to login */}
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <DashboardWithProtection isAuthenticated={isAuthenticated} /> : <Navigate to="/" replace />} 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

// Dashboard wrapper with back navigation protection
const DashboardWithProtection = ({ isAuthenticated }) => {
  // Use our custom hook to prevent back navigation
  usePreventBackNavigation(isAuthenticated);
  
  return <Dashboard />;
};

export default App;
