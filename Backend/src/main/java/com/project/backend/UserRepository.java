package com.project.backend;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {

    // ✅ find user by email (used in login)
    User findByEmail(String email);
}