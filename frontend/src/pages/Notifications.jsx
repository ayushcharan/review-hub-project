import React, { useEffect, useState } from "react";
import "./Notifications.css";

export default function Notifications() {
  const [data, setData] = useState([]);

  const user = localStorage.getItem("user");

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Fetch notifications
    fetch(`http://localhost:8080/api/notifications/${user}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(setData);

    // Mark as read
    fetch(`http://localhost:8080/api/notifications/read/${user}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).catch(err => console.error("Error marking notifications as read:", err));
  }, [user]);

  return (
    <div className="container">
      <h2>Notifications</h2>

      {data.length === 0 ? (
        <div className="notifications-empty">
          <div className="notifications-empty-icon">📭</div>
          <h3 className="notifications-empty-title">All Caught Up!</h3>
          <p className="notifications-empty-text">You have no new notifications to review right now.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {data.map((n, i) => (
            <div key={i} className="card notification-item">
              <div className="notification-dot"></div>
              <div className="notification-body">
                <p className="notification-message">{n.message}</p>
                <small className="notification-meta">{new Date().toLocaleDateString()} - System Event</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}