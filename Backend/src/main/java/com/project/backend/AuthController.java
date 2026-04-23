package com.project.backend;

import com.project.backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository repo;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository repo, AuthenticationManager authenticationManager, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // ✅ REGISTER API
    @PostMapping("/register")
    public String register(@RequestBody User user) {
        if (user.getEmail() == null || !user.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Invalid email format");
        }

        if (user.getContactNumber() == null || !user.getContactNumber().matches("^[0-9]{10}$")) {
            throw new RuntimeException("Invalid contact number. Must be 10 digits.");
        }

        // Check if user exists
        if (repo.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }

        // 🔥 ROLE LOGIC
        if (user.getEmail().toLowerCase().contains("admin")) {
            user.setRole("moderator");   // any email with 'admin' in it
        } else {
            user.setRole("user");        // normal user
        }

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repo.save(user);

        return "User registered successfully!";
    }

    // ✅ LOGIN API
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User loginData) {
        if (loginData.getEmail() == null || !loginData.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Invalid email format");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginData.getEmail(), loginData.getPassword())
        );

        User user = repo.findByEmail(loginData.getEmail());

        // 🔥 AUTO-UPGRADE ROLE IF NECESSARY
        if (user.getEmail().toLowerCase().contains("admin") && !"moderator".equals(user.getRole())) {
            user.setRole("moderator");
            repo.save(user); // Persistence
        }

        String jwt = jwtUtil.generateToken(user.getEmail(), user.getRole());

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("name", user.getName());

        return response;
    }
}