import React, { useEffect, useState } from "react";
import "./UserDashboard.css";

export default function UserDashboard() {
  const [reviews, setReviews] = useState([]);

  const user = localStorage.getItem("user");

  const ratingLabels = {
    1: "Poor 😞",
    2: "Fair 😐",
    3: "Good 🙂",
    4: "Very Good 😃",
    5: "Best 😍"
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/reviews", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  // ✅ Only APPROVED reviews (recommended)
  const approvedReviews = reviews.filter(r => r.status === "APPROVED");

  // ✅ My Reviews
  const myReviews = approvedReviews.filter(r => r.user === user);

  // ✅ Total Reviews
  const totalReviews = approvedReviews.length;

  // ✅ Average Rating
  const avg =
    approvedReviews.length > 0
      ? (
          approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
          approvedReviews.length
        ).toFixed(1)
      : 0;

  // ⭐ Rating Distribution (REAL DATA)
  const ratingCounts = [1, 2, 3, 4, 5].map((star) =>
    approvedReviews.filter((r) => r.rating === star).length
  );

  const getStatusClass = (status) => {
    if (status === "APPROVED") return "approved";
    if (status === "REJECTED") return "rejected";
    return "pending";
  };

  return (
    <div className="container">
      <h2>User Dashboard</h2>

      {/* 🔥 STATS */}
      <div className="grid">
        <div className="card stat">
          <span className="label">My Reviews</span>
          <span className="value">{myReviews.length}</span>
        </div>

        <div className="card stat">
          <span className="label">Total Reviews</span>
          <span className="value">{totalReviews}</span>
        </div>

        <div className="card stat">
          <span className="label">Average Rating</span>
          <span className="value">{avg}</span>
        </div>
      </div>

      {/* ⭐ REAL CHART */}
      <h3 className="userdash-section-title">Rating Distribution</h3>

      <div className="userdash-chart">
        {ratingCounts.map((count, index) => (
          <div key={index} className="userdash-chart-col">
            <div
              className="userdash-chart-bar"
              style={{ height: `${count === 0 ? 5 : count * 30}px` }}
            ></div>

            <p className="userdash-chart-label">{index + 1} ⭐</p>
            <small className="userdash-chart-count">{count}</small>
          </div>
        ))}
      </div>

      {/* 📝 MY REVIEWS */}
      <h3 className="userdash-section-title">My Reviews</h3>

      {myReviews.length === 0 ? (
        <div className="userdash-empty">
          You haven't written any reviews yet.
        </div>
      ) : (
        <div className="userdash-review-list">
          {myReviews.map((r, i) => (
            <div key={i} className="card userdash-review-item">
              
              <div className="userdash-avatar">
                {(user || "U")[0].toUpperCase()}
              </div>

              <div className="userdash-review-body">
                <div className="userdash-review-header">
                  <div>
                    <h4 className="userdash-review-product">Product #{r.productId}</h4>
                    <div className="userdash-review-stars">
                      {"★".repeat(r.rating)}
                      <span style={{ marginLeft: "8px", fontSize: "11px", color: "var(--primary)", fontWeight: "600" }}>
                        {ratingLabels[r.rating]}
                      </span>
                    </div>
                  </div>
                  
                  <span className={`userdash-status ${getStatusClass(r.status)}`}>
                    {r.status || "PENDING"}
                  </span>
                </div>

                <p className="userdash-review-comment">
                  "{r.comment}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}