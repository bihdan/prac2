package org.example.spring_react_postg.repository;

import org.example.spring_react_postg.model.Card;
import org.example.spring_react_postg.model.Deck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Репозиторій для роботи з об'єктами типу {@link Card}.
 * Використовує JPA для доступу до бази даних і надає методи для виконання запитів.
 */
@Repository
public interface CardRepository extends JpaRepository<Card, String> {

    /**
     * Знаходить список карток за ідентифікатором колоди.
     *
     * @param DeckId Ідентифікатор колоди.
     * @return Список карток, що належать до вказаної колоди.
     */
    List<Card> findByDeckId(String DeckId);

    /**
     * Знаходить картку за її лицьовою стороною (фронтом).
     *
     * @param front Текст, що міститься на лицьовій стороні картки.
     * @return Опційний об'єкт картки, що відповідає заданому фронту.
     */
    Optional<Card> findByFront(String front);


    @Query("SELECT c FROM Card c WHERE FUNCTION('split_part', c.id, '-', 1) = :confCode")
    List<Deck> findByConfirmationCode(@Param("confCode") String confCode);

    List<Card> findByDeckIdAndUpdatedAtBetween(String deckId, Instant start, Instant end);


}
