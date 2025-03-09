// src/NotFound.jsx
import React from "react";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 style={{ fontSize: "3rem", color: "#FF6347" }}>
        404 🚫 - Page Not Found
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#555" }}>
        Oops! The page you're looking for doesn't exist . 😕
      </p>
      <p style={{ fontSize: "1.1rem", color: "#888" }}>
        Please check the URL or head back to the homepage. 🌐
      </p>
    </div>
  );
};

export default NotFound;
