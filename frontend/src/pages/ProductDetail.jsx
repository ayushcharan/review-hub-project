import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../ToastContext";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useToast();

  const user = localStorage.getItem("user");
  
  const ratingLabels = {
    1: "Poor 😞",
    2: "Fair 😐",
    3: "Good 🙂",
    4: "Very Good 😃",
    5: "Best 😍"
  };

  useEffect(() => {
    // Fetch all products to find by ID since we don't know the exact single-fetch endpoint
    fetch("http://localhost:8080/api/products")
      .then(res => res.json())
      .then(data => {
        const found = data.find(p => p.id.toString() === id);
        setProduct(found);
      });

    fetchReviews();
  }, [id]);

  const fetchReviews = () => {
    fetch("http://localhost:8080/api/reviews")
      .then(res => res.json())
      .then(data => {
        // Filter reviews for this product immediately
        const prodReviews = data.filter(r => r.productId.toString() === id && r.status === "APPROVED");
        setReviews(prodReviews);
      });
  };

  if (!product) {
    return (
      <div className="container pd-container">
        <button className="btn btn-outline back-btn" onClick={() => navigate(-1)}>
          ← Back to Shop
        </button>
        <div className="pd-layout">
          <div className="pd-product-section">
            <div className="skeleton skeleton-img pd-image-wrapper"></div>
            <div className="skeleton skeleton-text" style={{ height: "40px", marginBottom: "20px" }}></div>
            <div className="skeleton skeleton-text-short" style={{ height: "30px" }}></div>
          </div>
          <div className="pd-review-section">
            <div className="skeleton skeleton-text" style={{ height: "100px", marginBottom: "40px" }}></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    stars: star,
    count: reviews.filter(r => r.rating === star).length
  }));

  const submitReview = () => {
    if (!user) {
      showToast("Please login to write a review!", "error");
      navigate("/login");
      return;
    }
    if (!rating) {
      showToast("Please select a rating ⭐", "error");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    fetch("http://localhost:8080/api/reviews", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        productId: product.id,
        rating,
        comment,
        user: user || "Guest"
      })
    })
      .then(res => res.text())
      .then(() => {
        showToast("Review added and pending approval!", "success");
        fetchReviews(); // Re-fetch
        setRating(0);
        setComment("");
        setIsSubmitting(false);
      })
      .catch(err => {
        setIsSubmitting(false);
        showToast("Error adding review", "error");
      });
  };

  // Helper: map product to DB image
  const getProductImage = (p) => {
    if (p.imageUrl && p.imageUrl.trim() !== "") {
      return p.imageUrl;
    }
    
    // Generic fallback tech product
    return "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=800&auto=format&fit=crop&q=80";
  };

  return (
    <div className="container pd-container">
      
      <button className="btn btn-outline back-btn" onClick={() => navigate(-1)}>
        ← Back to Shop
      </button>

      <div className="pd-layout">
        
        {/* LEFT COLUMN: Product Info */}
        <div className="pd-product-section">
          <div className="pd-image-wrapper">
            <img 
              src={getProductImage(product)} 
              alt={product.name} 
              className="pd-main-img"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=800&auto=format&fit=crop&q=80"; }}
            />
          </div>
          
          <div className="pd-info">
            <h1 className="pd-title">{product.name}</h1>
            <h2 className="pd-price">₹{product.price}</h2>
            
            <button className="btn btn-buy pd-buy-btn">Add to Cart</button>
            
            <div className="pd-description">
              <p>Experience the very best. This item is carefully crafted to bring you unparalleled performance and exquisite premium design.</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Reviews Section */}
        <div className="pd-review-section">
          
          <div className="pd-review-header">
            <div className="pd-overall-rating">
              <div className="pd-avg-number">{avgRating}</div>
              <div className="pd-stars">
                {"⭐".repeat(Math.round(avgRating))}
              </div>
              <div className="pd-responses">{totalReviews} responses</div>
            </div>

            <div className="pd-rating-bars">
              {ratingCounts.map(rc => (
                <div key={rc.stars} className="pd-bar-row">
                  <span className="pd-bar-label">{rc.stars} ★</span>
                  <div className="pd-bar-track">
                    <div 
                      className="pd-bar-fill" 
                      style={{ width: `${totalReviews > 0 ? (rc.count / totalReviews) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="pd-bar-count">{rc.count}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="pd-divider" />

          {/* WRITE REVIEW FORM */}
          <div className="pd-write-review">
            <h3>Write a Review</h3>
            <div className="pd-star-selector">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= rating ? "active" : ""}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            {rating > 0 && (
              <div className="pd-rating-label" style={{ 
                marginTop: "10px", 
                fontWeight: "600", 
                color: "var(--primary)",
                fontSize: "14px",
                animation: "fadeIn 0.3s ease"
              }}>
                {ratingLabels[rating]}
              </div>
            )}
            
            <textarea
              className="textarea pd-textarea"
              placeholder="What did you think about this product?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            
            <button 
              className="btn btn-primary" 
              onClick={submitReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>

          <hr className="pd-divider" />

          {/* REVIEW LIST */}
          <div className="pd-review-list">
            <h3>Recent Reviews</h3>
            {reviews.length === 0 ? (
              <p className="no-review">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((r, i) => (
                <div key={i} className="pd-review-item">
                  <div className="pd-reviewer-avatar">
                    {(r.user || "G")[0].toUpperCase()}
                  </div>
                  <div className="pd-review-content">
                    <div className="pd-reviewer-name">{r.user || "Guest"}</div>
                    <div className="pd-review-stars">
                      <span className="star active" style={{fontSize: "14px"}}>{"★".repeat(r.rating)}</span>
                      <span style={{ marginLeft: "8px", fontSize: "12px", color: "var(--primary)", fontWeight: "600" }}>
                        {ratingLabels[r.rating]}
                      </span>
                    </div>
                    <p className="pd-review-text">{r.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
