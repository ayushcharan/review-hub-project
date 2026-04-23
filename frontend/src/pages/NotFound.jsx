import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="container notfound-container">
      <div className="notfound-icon">🚧</div>
      <h1 className="notfound-title">
        Page Not Found
      </h1>
      <p className="notfound-message">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <button 
        className="btn btn-primary notfound-home-btn" 
        onClick={() => navigate("/")}
      >
        Return Home
      </button>
    </div>
  );
}
