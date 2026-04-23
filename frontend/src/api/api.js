
import axios from "axios";
import { USE_MOCK } from "../config";

const API = axios.create({ baseURL: "http://localhost:8080/api" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// -------- MOCK DATA --------
const mock = {
  products: [
    { product_id: 1, name: "Football", average_rating: 4.5 },
    { product_id: 2, name: "Cricket Bat", average_rating: 4.2 },
    { product_id: 3, name: "Tennis Racket", average_rating: 4.6 }
  ],
  analytics: { total_products: 50, total_reviews: 1200, avg_rating: 4.3 },
  userReviews: [
    { id: 1, review_body: "Amazing product!", rating: 5 },
    { id: 2, review_body: "Good quality", rating: 4 },
    { id: 3, review_body: "Value for money", rating: 4 }
  ],
  notifications: [
    { id: 1, message: "Your review was approved" },
    { id: 2, message: "New product added: Tennis Racket" }
  ]
};

// helper
async function tryOrMock(call, mockData){
  if (USE_MOCK) return { data: mockData };
  try {
    return await call();
  } catch (e) {
    // fallback to mock if API fails
    return { data: mockData };
  }
}

// AUTH
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

// PRODUCTS
export const getProducts = (params) =>
  tryOrMock(() => API.get("/products", { params }), mock.products);

// ANALYTICS
export const getAnalytics = () =>
  tryOrMock(() => API.get("/analytics/overview"), mock.analytics);

// USER DASHBOARD
export const getUserReviews = () =>
  tryOrMock(() => API.get("/users/my-reviews"), mock.userReviews);

// NOTIFICATIONS
export const getNotifications = (email) =>
  tryOrMock(() => API.get(`/notifications/${email}`), mock.notifications);

// MODERATOR
export const getPending = () =>
  tryOrMock(() => API.get("/reviews/pending"), [
    { review_id: 1, review_body: "Great product!" },
    { review_id: 2, review_body: "Needs improvement" }
  ]);

export const updateReview = (id, status) =>
  API.put(`/reviews/${id}?status=${status}`);


// -------- NEW: REVIEWS --------
export const getProductReviews = (productId) =>
  tryOrMock(
    () => API.get(`/reviews/product/${productId}`),
    [
      { id: 1, productId: productId, review_body: "Excellent!", rating: 5, user: "User1" },
      { id: 2, productId: productId, review_body: "Nice", rating: 4, user: "User2" }
    ]
  );

export const addReview = (data) =>
  tryOrMock(
    () => API.post("/reviews", data),
    { success: true }
  );
