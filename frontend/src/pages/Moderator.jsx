import React, { useEffect, useState } from "react";
import "./Moderator.css";

function Moderator() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const ratingLabels = {
    1: "Poor 😞",
    2: "Fair 😐",
    3: "Good 🙂",
    4: "Very Good 😃",
    5: "Best 😍"
  };

  const fetchReviews = () => {
    fetch("http://localhost:8080/api/reviews")
      .then(res => res.json())
      .then(setReviews);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateStatus = (id, status) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/reviews/${id}?status=${status}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then(() => fetchReviews());
  };

  // 🔥 DELETE FUNCTION
  const deleteReview = (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:8080/api/reviews/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then(() => {
      alert("Review deleted!");
      fetchReviews();
    });
  };

  // 🔥 FILTER LOGIC
  const filteredReviews = reviews.filter(r => {
    if (filter === "ALL") return true;
    return r.status === filter;
  });

  const getStatusClass = (status) => {
    if (status === "APPROVED") return "approved";
    if (status === "REJECTED") return "rejected";
    return "pending";
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      {/* 🔥 FILTER DROPDOWN */}
      <div className="moderator-filter">
        <label>Filter: </label>
        <select className="select" onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {filteredReviews.length === 0 && (
        <div className="moderator-empty">
          No reviews found in this category.
        </div>
      )}

      {filteredReviews.length > 0 && (
        <div className="moderator-table-wrap">
          <table className="moderator-table">
            <thead>
              <tr>
                <th>Prod_ID</th>
                <th>User</th>
                <th>Rating & Comment</th>
                <th>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((r) => (
                <tr key={r.id}>
                  <td className="moderator-product-id">#{r.productId}</td>
                  <td>{r.user || "Guest"}</td>
                  <td className="moderator-comment-cell">
                    <span className="moderator-stars">{"★".repeat(r.rating)}</span>
                    <span style={{ marginLeft: "8px", fontSize: "12px", color: "var(--primary)", fontWeight: "bold" }}>
                      {ratingLabels[r.rating]}
                    </span>
                    <br/>
                    <span className="moderator-comment-text">{r.comment}</span>
                  </td>
                  <td>
                    <span className={`moderator-status ${getStatusClass(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="moderator-actions">
                    <div className="moderator-actions-inner">
                      {r.status !== "APPROVED" && (
                        <button className="btn btn-outline" onClick={() => updateStatus(r.id, "APPROVED")}>Approve</button>
                      )}
                      {r.status !== "REJECTED" && (
                        <button className="btn btn-outline" onClick={() => updateStatus(r.id, "REJECTED")}>Reject</button>
                      )}
                      <button className="btn btn-primary moderator-delete-btn" onClick={() => deleteReview(r.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Moderator;