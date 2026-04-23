import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ToastContext";
import "./Register.css";

export default function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "", contactNumber: "" });
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

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(data.contactNumber)) {
      showToast("Please enter a valid 10-digit contact number", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          contactNumber: data.contactNumber
        })
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const msg = await res.text();

      showToast("User registered successfully!", "success");

      nav("/login");
    } catch (e) {
      showToast("Backend not connected or error!", "error");
    }
  };

  return (
    <div className="center">
      <div className="auth-card">
        <div className="h1">Create Account</div>
        <div className="muted">Join Review-Hub in seconds</div>

        <label>Name</label>
        <input
          className="input"
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <label>Email</label>
        <input
          type="email"
          className="input"
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <label>Contact Number</label>
        <input
          type="tel"
          className="input"
          onChange={(e) => setData({ ...data, contactNumber: e.target.value })}
        />

        <label>Password</label>
        <input
          type="password"
          className="input"
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />

        <button
          className="btn btn-primary register-submit-btn"
          onClick={submit}
        >
          Register
        </button>
      </div>
    </div>
  );
}