import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ToastContext";
import "./Login.css";

export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [loginType, setLoginType] = useState("user"); // 'user' or 'moderator'
  const nav = useNavigate();
  const showToast = useToast();

  const submit = async () => {
    // ✅ validation
    if (!data.email || !data.password) {
      showToast("Please fill all fields", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showToast("Please enter a valid email address with a domain (e.g., @gmail.com)", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        throw new Error("Login failed");
      }

      const user = await res.json();

      // Role validation for Moderator tab
      if (loginType === "moderator" && user.role !== "moderator") {
        showToast("Access Denied: You are not a moderator!", "error");
        return;
      }

      // ✅ Store REAL data
      localStorage.setItem("user", user.email);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("role", user.role);
      localStorage.setItem("token", user.token);

      showToast("Login successful!", "success");

      // Smart routing based on tab/role
      if (loginType === "moderator") {
        nav("/moderator");
      } else {
        nav("/");
      }
    } catch (e) {
      showToast("Invalid email or password", "error");
    }
  };

  return (
    <div className="center">
      <div className="auth-card">
        <div className="h1">{loginType === 'moderator' ? 'Moderator Portal' : 'Welcome Back'}</div>
        <div className="muted">Sign in to your Review-Hub account</div>

        <div className="login-type-toggle">
          <button 
            className={`btn ${loginType === 'user' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setLoginType('user')}
          >
            User
          </button>
          <button 
            className={`btn ${loginType === 'moderator' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setLoginType('moderator')}
          >
            Moderator
          </button>
        </div>

        <label>Email Address</label>
        <input
          type="email"
          className="input"
          placeholder="you@example.com"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <label>Password</label>
        <input
          type="password"
          className="input"
          placeholder="••••••••"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button
          className="btn btn-primary login-submit-btn"
          onClick={submit}
        >
          Sign In
        </button>

        <div className="space"></div>
        <div className="muted">
          Don't have an account? <a href="/register">Register here</a>
        </div>
      </div>
    </div>
  );
}