package com.project.backend;

import jakarta.persistence.*;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String email;
    private String password;
    private String role; // ✅ ADD THIS
    private String contactNumber;
    private String name; // ✅ Added name field

    public User() {}

    public User(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public int getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getRole() { return role; }
    public String getContactNumber() { return contactNumber; }
    public String getName() { return name; } // ✅ Added getName

    public void setRole(String role) { this.role = role; }
    public void setPassword(String password) { this.password = password; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
    public void setName(String name) { this.name = name; } // ✅ Added setName
}