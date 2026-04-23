package com.project.backend;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private double price;
    private String imageUrl;
    private String description;

    // JPA requires a no-arg constructor
    public Product() {}

    // ✅ UPDATED CONSTRUCTOR
    public Product(int id, String name, double price, String imageUrl) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }


    // GETTERS

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    // SETTER (optional but good)
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}