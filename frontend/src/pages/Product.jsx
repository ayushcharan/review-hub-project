import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";

function Product() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // 🔥 NEW STATES
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(12);

  const navigate = useNavigate();


  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/products").then(res => res.json()),
      fetch("http://localhost:8080/api/reviews").then(res => res.json())
    ]).then(([productsData, reviewsData]) => {
      setProducts(productsData);
      setReviews(reviewsData);
      setIsLoading(false);
    });
  }, []);

  const getAverageRating = (productId) => {
    const productReviews = reviews.filter(
      r => r.productId === productId && r.status === "APPROVED"
    );
    if (productReviews.length === 0) return 0;

    const total = productReviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / productReviews.length).toFixed(1);
  };

  // 🔥 DYNAMIC RANKING LOGIC
  const rankings = useMemo(() => {
    if (products.length === 0 || reviews.length === 0) return {};

    const productsWithRatings = products.map(p => {
      const avg = parseFloat(getAverageRating(p.id));
      return { id: p.id, avg };
    });

    // Sort by average rating descending, then by price (as tie-breaker or secondary factor)
    const sorted = [...productsWithRatings]
      .filter(p => p.avg > 0)
      .sort((a, b) => b.avg - a.avg);

    const rankMap = {};
    sorted.slice(0, 3).forEach((p, index) => {
      rankMap[p.id] = index + 1;
    });
    return rankMap;
  }, [products, reviews]);


  // 🔥 FILTER + SEARCH + SORT LOGIC
  let filteredProducts = products
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter(p =>
      maxPrice ? p.price <= Number(maxPrice) : true
    )
    .filter(p => {
      if (category === "all") return true;
      return p.name.toLowerCase().includes(category);
    });

  if (sort === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Helper: map product to DB image
  const getProductImage = (p) => {
  if (p.imageUrl && p.imageUrl.trim() !== "") {
    let url = p.imageUrl;

    // Ensure proper params exist
    if (!url.includes("auto=format")) {
      url += "&auto=format&fit=crop&q=80";
    }

    return url;
  }

  return "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&auto=format&fit=crop&q=80";
};

  return (
    <div className="container">

      {/* 🔥 FILTER BAR (Integrated Search) */}
      <div className="filter-container" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        <input
          className="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flexGrow: 1, minWidth: '300px' }}
        />

        <input
          className="input"
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ width: 'auto', margin: 0 }}
        />

        <select className="select" style={{ width: 'auto', margin: 0 }} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All</option>
          <option value="laptop">Laptop</option>
          <option value="mobile">Mobile</option>
          <option value="headphone">Headphones</option>
        </select>

        <select onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort</option>
          <option value="low">Price Low → High</option>
          <option value="high">Price High → Low</option>
        </select>

      </div>

      {/* 🛍 PRODUCTS */}
      <div className="grid">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card">
              <div className="skeleton skeleton-img"></div>
              <div className="skeleton skeleton-text"></div>
              <div className="skeleton skeleton-text-short"></div>
              <div className="skeleton skeleton-text" style={{marginTop: "20px"}}></div>
            </div>
          ))
        ) : filteredProducts.length === 0 ? (
          <p style={{ textAlign: "center" }}>No products found 😕</p>
        ) : (
          filteredProducts.slice(0, visibleCount).map((p) => (
            <div key={p.id} className="card">
              {rankings[p.id] && (
                <div className="top-rated-badge">
                  #{rankings[p.id]} Top Rated
                </div>
              )}

              <img
                src={getProductImage(p)}
                alt={p.name}
                className="product-img"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=600&auto=format&fit=crop&q=80";
                }}
              />

              <h3 className="product-title">{p.name}</h3>
              <p className="price">₹{p.price}</p>

              <div className="rating-container">
                {getAverageRating(p.id) > 0 ? (
                  <>
                    <div className="stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < Math.round(getAverageRating(p.id)) ? "star-filled" : "star-empty"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="rating-value">({getAverageRating(p.id)})</span>
                  </>
                ) : (
                  <span className="no-rating">No rating yet</span>
                )}
              </div>

            <button
              className="btn btn-review"
              onClick={() => navigate(`/product/${p.id}`)}
              style={{ width: "100%", marginTop: "10px" }}
            >
              View Details & Reviews
            </button>
          </div>
        )))}
      </div>

      {/* 🔄 LOAD MORE BUTTON */}
      {!isLoading && filteredProducts.length > visibleCount && (
        <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "20px" }}>
          <button 
            className="btn btn-outline" 
            style={{ padding: "12px 30px", fontSize: "16px", borderRadius: "30px", background: "var(--card-bg)" }}
            onClick={() => setVisibleCount(prev => prev + 12)}
          >
            Load More Products ↓
          </button>
        </div>
      )}
    </div>
  );
}

export default Product;