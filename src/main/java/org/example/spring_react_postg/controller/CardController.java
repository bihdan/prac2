package org.example.spring_react_postg.controller;

import org.example.spring_react_postg.model.Card;
import org.example.spring_react_postg.security.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

/**
 * Контролер для обробки HTTP-запитів, пов'язаних з картками {@link Card}.
 * Надає кінцеві точки для отримання всіх карток, картки за ідентифікатором
 * та карток, що належать певній колоді.
 */
@RestController
@RequestMapping("/api/cards")
public class CardController {

    @Autowired
    private CardService cardService;

    /**
     * Отримує всі картки.
     *
     * @return список усіх карток у форматі {@link ResponseEntity}.
     */
    @GetMapping
    public ResponseEntity<List<Card>> getAllCards() {
        List<Card> cards = cardService.getAllCards();
        return ResponseEntity.ok(cards);
    }

//    /**
//     * Отримує картку за її унікальним ідентифікатором.
//     *
//     * @param id ідентифікатор картки
//     * @return {@link Optional} обʼєкт картки, якщо вона існує
//     */
//    @GetMapping("/{id}")
//    public Optional<Card> getCardById(@PathVariable Integer id) {
//        return cardService.getCardById(id);
//    }
//
//    /**
//     * Отримує список карток, що належать до певної колоди.
//     *
//     * @param deckId ідентифікатор колоди
//     * @return список карток, повʼязаних з даною колодою, у форматі {@link ResponseEntity}
//     */
//    @GetMapping("/deck/{deckId}")
//    public ResponseEntity<List<Card>> getCardsByDeckId(@PathVariable Integer deckId) {
//        List<Card> cards = cardService.getCardsByDeckId(deckId);
//        return ResponseEntity.ok(cards);
//    }

}
