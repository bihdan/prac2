package org.example.spring_react_postg.controller;

import org.example.spring_react_postg.model.Deck;
import org.example.spring_react_postg.security.service.DeckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Контролер для обробки HTTP-запитів, пов'язаних з колодами {@link Deck}.
 * Надає функціональність для отримання, створення та видалення колод.
 */
@RestController
@RequestMapping("/api/decks")
public class DeckController {

    @Autowired
    private DeckService deckService;

    /**
     * Отримує всі наявні колоди.
     *
     * @return список усіх {@link Deck} у форматі {@link ResponseEntity}
     */
    @GetMapping
    public ResponseEntity<List<Deck>> getAllDecks() {
        List<Deck> decks = deckService.getAllDecks();
        return ResponseEntity.ok(decks);
    }

    @PostMapping("/code")
    public ResponseEntity<List<Deck>> getDecksByCode(String code) {

        List<Deck> decks = deckService.getDecksByConfirmationCode(code);
        return ResponseEntity.ok(decks);

    }

//    /**
//     * Отримує всі колоди, створені певним користувачем.
//     *
//     * @param userId ідентифікатор користувача
//     * @return список {@link Deck}, що належать користувачу
//     */
//    @GetMapping("/user/{userId}")
//    public List<Deck> getDecksByUserId(@PathVariable Integer userId) {
//        return deckService.getDecksByUserId(userId);
//    }

//    /**
//     * Отримує колоду за її унікальним ідентифікатором.
//     *
//     * @param id ідентифікатор колоди
//     * @return {@link Optional} обʼєкт колоди, якщо вона існує
//     */
//    @GetMapping("/{id}")
//    public Optional<Deck> getDeckById(@PathVariable Integer id) {
//        return deckService.getDeckById(id);
//    }

    /**
     * Створює нову колоду.
     *
     * @param deck обʼєкт {@link Deck}, що буде збережений
     * @return створений обʼєкт {@link Deck}
     */
    @PostMapping
    public Deck createDeck(@RequestBody Deck deck) {
        return deckService.saveDeck(deck);
    }

//    /**
//     * Видаляє колоду за її ідентифікатором.
//     *
//     * @param id ідентифікатор колоди, яку потрібно видалити
//     */
//    @DeleteMapping("/delete/{id}")
//    public void deleteDeck(@PathVariable Integer id) {
//        deckService.deleteDeck(id);
//    }
}
