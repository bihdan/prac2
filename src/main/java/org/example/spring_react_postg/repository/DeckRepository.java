package org.example.spring_react_postg.repository;

import org.example.spring_react_postg.model.Card;
import org.example.spring_react_postg.model.Deck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Репозиторій для роботи з таблицею {@code deck}.
 * Використовується для виконання операцій з колодами карт у базі даних.
 */
@Repository
public interface DeckRepository extends JpaRepository<Deck, String> {

    Optional<Deck> findByName(String name);

    @Query("SELECT d FROM Deck d WHERE FUNCTION('split_part', d.id, '-', 1) = :confCode")
    List<Deck> findByConfirmationCode(@Param("confCode") String confCode);
}
