package org.example.spring_react_postg.security.service;

import org.example.spring_react_postg.model.Card;
import org.example.spring_react_postg.model.DTO.CardDTO;
import org.example.spring_react_postg.model.DTO.DeckDTO;
import org.example.spring_react_postg.model.Deck;
import org.example.spring_react_postg.repository.CardRepository;
import org.example.spring_react_postg.repository.DeckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Сервіс для роботи з картками.
 * Використовує {@link CardRepository} для виконання операцій з базою даних,
 * таких як отримання карток, їх збереження та фільтрація.
 */
@Service
public class CardService {
    private final CardRepository cardRepository;

    private final DeckRepository deckRepository;

    /**
     * Конструктор для ін'єкції залежностей через {@link CardRepository}.
     *
     * @param cardRepository Репозиторій для карток.
     */
    @Autowired
    public CardService(CardRepository cardRepository, DeckRepository deckRepository) {
        this.cardRepository = cardRepository;
        this.deckRepository = deckRepository;
    }

    /**
     * Отримує всі картки з бази даних.
     *
     * @return Список всіх карток.
     */
    public List<Card> getAllCards() {
        return cardRepository.findAll();
    }

    /**
     * Отримує картку за її ідентифікатором.
     *
     * @param id Ідентифікатор картки.
     * @return Опційний об'єкт картки з вказаним ідентифікатором.
     */
    public Optional<Card> getCardById(String id) {
        return cardRepository.findById(id);
    }

    /**
     * Отримує картку за її лицьовою стороною (фронтом).
     *
     * @param front Текст, що міститься на лицьовій стороні картки.
     * @return Опційний об'єкт картки з вказаним фронтом.
     */
    public Optional<Card> getCardByFront(String front) {
        return cardRepository.findByFront(front);
    }

    /**
     * Зберігає картку в базі даних.
     *
     * @param card Картка для збереження.
     * @return Збережена картка.
     */
    public Card saveCard(Card card) {
        return cardRepository.save(card);
    }

    /**
     * Отримує картки за ідентифікатором колоди.
     *
     * @param deckId Ідентифікатор колоди.
     * @return Список карток, що належать до вказаної колоди.
     */
    public List<Card> getCardsByDeckId(String deckId) {
        return cardRepository.findByDeckId(deckId);
    }

    public void saveOrUpdateCard(CardDTO dto) {
        Optional<Card> optionalCard = cardRepository.findById(dto.getId());

        if (optionalCard.isPresent()) {
            Card existing = optionalCard.get();
            if (dto.getUpdatedAt().isAfter(existing.getUpdatedAt())) {
                existing = new Card(dto);
//                existing.setFront(dto.getFront());
//                existing.setBack(dto.getBack());
//                existing.setFlag(dto.getFlag());
//                existing.setEndDate(dto.getEndDate());
//                existing.setDaysJump(dto.getDaysJump());
//                existing.setEase(dto.getEase());
//                existing.setUpdatedAt(dto.getUpdatedAt());
//                existing.setLapses(dto.getLapses());
//                existing.setReviews(dto.getReviews());
//                existing.setNotes(dto.getNotes());
                cardRepository.save(existing);
            }
        } else {
            Card newCard = new Card(dto);
//            newCard.setId(dto.getId());
//            newCard.setDeckId(dto.getDeckId());
//            newCard.setFront(dto.getFront());
//            newCard.setBack(dto.getBack());
//            newCard.setFlag(dto.getFlag());
//            newCard.setEndDate(dto.getEndDate());
//            newCard.setDaysJump(dto.getDaysJump());
//            newCard.setEase(dto.getEase());
//            newCard.setUpdatedAt(dto.getUpdatedAt());
//            newCard.setLapses(dto.getLapses());
//            newCard.setReviews(dto.getReviews());
//            newCard.setNotes(dto.getNotes());
            cardRepository.save(newCard);
        }
    }

//    private void setAll(Card card){
//        card.setId(dto.getId());
//        card.setDeckId(dto.getDeckId());
//        card.setFront(dto.getFront());
//        card.setBack(dto.getBack());
//        card.setFlag(dto.getFlag());
//        card.setEndDate(dto.getEndDate());
//        card.setDaysJump(dto.getDaysJump());
//        card.setEase(dto.getEase());
//        card.setUpdatedAt(dto.getUpdatedAt());
//        card.setLapses(dto.getLapses());
//        card.setReviews(dto.getReviews());
//        card.setNotes(dto.getNotes());
//    }
}
