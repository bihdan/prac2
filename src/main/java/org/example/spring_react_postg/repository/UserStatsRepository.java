package org.example.spring_react_postg.repository;

import org.example.spring_react_postg.model.UserStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, Integer> {

    Optional<UserStats> findByUserId(int user_id);

}
