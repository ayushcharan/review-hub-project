package com.project.backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository repo;
    private final NotificationController notificationController;

    // ✅ Constructor Injection
    public ReviewController(ReviewRepository repo, NotificationController notificationController) {
        this.repo = repo;
        this.notificationController = notificationController;
    }

    // ✅ Add review (saved in DB)
    @PostMapping
    public String addReview(@RequestBody Review review) {
        review.setStatus("PENDING"); // default
        repo.save(review);
        return "Review saved!";
    }

    // ✅ Get all reviews (from DB)
    @GetMapping
    public List<Review> getReviews() {
        return repo.findAll();
    }

    // ✅ Approve / Reject review + SEND NOTIFICATION
    @PutMapping("/{id}")
    public String updateStatus(@PathVariable int id, @RequestParam String status) {
        Review review = repo.findById(id).orElse(null);

        if (review != null) {
            review.setStatus(status);
            repo.save(review);

            // 🔥 SEND NOTIFICATION
            if (status.equalsIgnoreCase("APPROVED")) {
                notificationController.addNotification(
                        new Notification("Your review was approved!", review.getUser())
                );
            } else if (status.equalsIgnoreCase("REJECTED")) {
                notificationController.addNotification(
                        new Notification("Your review was rejected!", review.getUser())
                );
            }

            return "Status updated!";
        }

        return "Review not found";
    }

    // ✅ DELETE REVIEW (NEW FEATURE)
    @DeleteMapping("/{id}")
    public String deleteReview(@PathVariable int id) {
        Review review = repo.findById(id).orElse(null);

        if (review != null) {
            repo.delete(review);

            // 🔥 SEND NOTIFICATION (OPTIONAL BUT IMPRESSIVE)
            notificationController.addNotification(
                    new Notification("Your review was deleted by admin!", review.getUser())
            );

            return "Review deleted!";
        }

        return "Review not found";
    }
}