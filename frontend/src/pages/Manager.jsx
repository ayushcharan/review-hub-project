import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Product.css"; // Reuse premium styles for badges
import "./Manager.css";

export default function Manager() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then(res => res.json())
      .then(setProducts);

    fetch("http://localhost:8080/api/reviews")
      .then(res => res.json())
      .then(setReviews);
  }, []);

  // ✅ Total Products
  const totalProducts = products.length;

  // ✅ Only APPROVED reviews
  const approvedReviews = reviews.filter(r => r.status === "APPROVED");

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

  // ⭐ Rating Distribution
  const ratingCounts = [1, 2, 3, 4, 5].map((star) =>
    approvedReviews.filter((r) => r.rating === star).length
  );

  // 📈 PRODUCT PERFORMANCE DATA
  const [sortOption, setSortOption] = useState("rating-desc");

  const productPerformance = useMemo(() => {
    const stats = products.map(p => {
      const productReviews = approvedReviews.filter(r => r.productId === p.id);
      const total = productReviews.length;
      const avg = total > 0 ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1) : 0;
      return { ...p, totalReviews: total, avgRating: parseFloat(avg) };
    });

    return [...stats].sort((a, b) => {
      if (sortOption === "rating-desc") return b.avgRating - a.avgRating;
      if (sortOption === "rating-asc") return a.avgRating - b.avgRating;
      if (sortOption === "reviews-desc") return b.totalReviews - a.totalReviews;
      if (sortOption === "reviews-asc") return a.totalReviews - b.totalReviews;
      return 0;
    });
  }, [products, approvedReviews, sortOption]);

  return (
    <div className="container">
      <h2>Manager Dashboard</h2>

      {/* 🔥 STATS */}
      <div className="grid">
        <div className="card stat">
          <span className="label">Total Products</span>
          <span className="value">{totalProducts}</span>
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

      {/* 📊 REAL CHART */}
      <h3 className="manager-section-title">Rating Overview</h3>

      <div className="manager-chart">
        {ratingCounts.map((count, index) => (
          <div key={index} className="manager-chart-col">
            <div
              className="manager-chart-bar"
              style={{ height: `${count === 0 ? 5 : count * 30}px` }}
            ></div>

            <p className="manager-chart-label">{index + 1} ⭐</p>
            <small className="manager-chart-count">{count}</small>
          </div>
        ))}
      </div>

      {/* 📦 PRODUCT PERFORMANCE LIST */}
      <div className="manager-perf-header">
        <h3>Product Performance Detail</h3>
        
        <div className="manager-sort-wrapper">
          <label className="manager-sort-label">Sort By:</label>
          <select 
            className="manager-sort-select"
            value={sortOption} 
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="rating-desc">Rating: High → Low</option>
            <option value="rating-asc">Rating: Low → High</option>
            <option value="reviews-desc">Reviews: Most → Least</option>
            <option value="reviews-asc">Reviews: Least → Most</option>
          </select>
        </div>
      </div>

      <div className="card manager-perf-card">
        <table className="manager-perf-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Product</th>
              <th>Reviews</th>
              <th>Avg Rating</th>
            </tr>
          </thead>
          <tbody>
            {productPerformance.map((p, index) => (
              <tr key={p.id}>
                <td>
                  {index < 3 ? (
                    <span className="top-rated-badge manager-rank-badge">
                      #{index + 1}
                    </span>
                  ) : (
                    <span className="manager-rank-text">#{index + 1}</span>
                  )}
                </td>
                <td className="manager-product-name">{p.name}</td>
                <td>
                  <Link 
                    to={`/product/${p.id}`} 
                    className="manager-review-count"
                    style={{ textDecoration: "none" }}
                  >
                    {p.totalReviews} reviews
                  </Link>
                </td>
                <td>
                  <span className="manager-avg-rating">
                    {p.avgRating > 0 ? `⭐ ${p.avgRating}` : "No rating"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}