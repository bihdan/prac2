package org.example.spring_react_postg.repository;

import org.example.spring_react_postg.model.AuthToken;
import org.example.spring_react_postg.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthTokenRepository extends JpaRepository<AuthToken, Long> {
    Optional<AuthToken> findByToken(String token);
    Optional<AuthToken> findByUserId(int user_id);
}
