import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../ToastContext";

export default function Navbar(){
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Triggers re-render on route change
  const showToast = useToast();

  const user = localStorage.getItem("user");
  const userName = localStorage.getItem("userName");
  const role = localStorage.getItem("role");
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch unread count
  useEffect(() => {
    if (!user) return;
    const fetchCount = () => {
      const token = localStorage.getItem("token");
      fetch(`http://localhost:8080/api/notifications/count/${user}`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(count => setNotificationCount(count))
        .catch(err => console.error("Error fetching notification count:", err));
    };

    fetchCount();
    const interval = setInterval(fetchCount, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, [user, location.pathname]); // Re-fetch on route change too

  const handleLogout = () => {
    localStorage.clear();
    showToast("Logged out successfully", "success");
    // setTimeout to allow toast to render before possible reload or navigate
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  return (
    <div className="navbar" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <div className="nav-inner">
        
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Apps Grid Icon Dropdown */}
          <div className="app-menu-container" ref={menuRef} style={{ position: "relative" }}>
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "8px", borderRadius: "8px", color: "var(--text)"
              }}
              title="Apps Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <circle cx="5" cy="5" r="2"/>
                <circle cx="12" cy="5" r="2"/>
                <circle cx="19" cy="5" r="2"/>
                <circle cx="5" cy="12" r="2"/>
                <circle cx="12" cy="12" r="2"/>
                <circle cx="19" cy="12" r="2"/>
                <circle cx="5" cy="19" r="2"/>
                <circle cx="12" cy="19" r="2"/>
                <circle cx="19" cy="19" r="2"/>
              </svg>
            </button>
            
            {menuOpen && (
              <div 
                className="app-dropdown card"
                style={{
                  position: "absolute", top: "100%", left: 0, marginTop: "10px",
                  display: "flex", flexDirection: "column", minWidth: "220px",
                  padding: "10px", gap: "5px", zIndex: 1000
                }}
              >
                <Link to="/" onClick={() => setMenuOpen(false)} style={{ padding: "10px", textDecoration: "none", color: "var(--text)", borderRadius: "8px" }} className="dropdown-link">🛍️ Products</Link>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ padding: "10px", textDecoration: "none", color: "var(--text)", borderRadius: "8px" }} className="dropdown-link">📊 My Dashboard</Link>
                <Link to="/notifications" onClick={() => setMenuOpen(false)} style={{ padding: "10px", textDecoration: "none", color: "var(--text)", borderRadius: "8px" }} className="dropdown-link">🔔 Notifications</Link>
                {role === "admin" || role === "moderator" ? (
                  <Link to="/manager" onClick={() => setMenuOpen(false)} style={{ padding: "10px", textDecoration: "none", color: "var(--text)", borderRadius: "8px" }} className="dropdown-link">📈 Manager Report</Link>
                ) : null}
              </div>
            )}
          </div>
          
          <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            Review-Hub
          </div>
        </div>

        <div className="nav-links">
          <button 
            onClick={() => setIsDark(!isDark)} 
            style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: "18px", marginRight: "10px" }}
            title="Toggle Dark Mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Link to="/notifications" style={{ textDecoration: "none", position: "relative", display: "flex", alignItems: "center" }} title="Notifications">
                <span style={{ fontSize: "20px" }}>🔔</span>
                {notificationCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "#ef4444",
                    color: "white",
                    fontSize: "10px",
                    padding: "2px 6px",
                    borderRadius: "50%",
                    fontWeight: "bold",
                    border: "2px solid var(--card-bg)"
                  }}>
                    {notificationCount}
                  </span>
                )}
              </Link>
              <span style={{ fontWeight: 600, color: "var(--text)" }}>👤 {userName || user}</span>
              
              {role === "moderator" && (
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/moderator")}
                >
                  Admin Panel
                </button>
              )}
              
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{ display: "inline-flex" }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ display: "inline-flex" }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
