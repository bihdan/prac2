package org.example.spring_react_postg.model;

import jakarta.persistence.*;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;


@Entity
@Table(name = "auth_token")
public class AuthToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 512)
    private String token;

    @Column(nullable = true)
    private String userAgent;

    @Column(nullable = false)
    private LocalDateTime createdAt ;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public String generateUuid(){
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }

    public String generateToken(User user, String userAgent) {
        try {
            String data = user.getId() + "-" + Instant.now().toEpochMilli() + "-" + userAgent;

            byte[] randomBytes = new byte[16];
            new SecureRandom().nextBytes(randomBytes);
            String randomPart = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);

            String raw = data + "-" + randomPart;

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes());

            return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate token", e);
        }
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
