package com.project.backend;

import jakarta.persistence.*;

@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;   // ✅ REQUIRED for DB

    private int productId;
    private int rating;
    private String comment;
    private String user;

    private String status = "PENDING";   // ✅ NEW (Admin approval)

    // ✅ Default constructor (IMPORTANT for JPA)
    public Review() {}

    // ✅ Updated constructor
    public Review(int productId, int rating, String comment, String user) {
        this.productId = productId;
        this.rating = rating;
        this.comment = comment;
        this.user = user;
        this.status = "PENDING";
    }

    // ✅ GETTERS

    public int getId() {
        return id;
    }

    public int getProductId() {
        return productId;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public String getUser() {
        return user;
    }

    public String getStatus() {
        return status;
    }

    // ✅ SETTERS

    public void setId(int id) {
        this.id = id;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}