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

//    /**
//     * Знаходить колоди, що належать певному користувачу за його ідентифікатором.
//     *
//     * @param confirmation_code ідентифікатор користувача
//     * @return список колод, які належать користувачу з вказаним {@code userId}
//     */
//    List<Deck> findByUserConfirmationCode(String confirmation_code);

//
//    @Query("SELECT d FROM Deck d WHERE d.user.confirmationCode = :confCode")
//    List<Deck> findDecksByUserConfCode(@Param("confCode") String confCode);
    Optional<Deck> findByName(String name);

    @Query("SELECT d FROM Deck d WHERE FUNCTION('split_part', d.id, '-', 1) = :confCode")
    List<Deck> findByConfirmationCode(@Param("confCode") String confCode);
}
