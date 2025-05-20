package org.example.spring_react_postg.security.service;

import org.example.spring_react_postg.model.DTO.DeckDTO;
import org.example.spring_react_postg.model.Deck;
import org.example.spring_react_postg.repository.DeckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Сервіс для роботи з колодами карт.
 * Містить методи для виконання операцій з колодами, таких як отримання, збереження та видалення.
 */
@Service
public class DeckService {

    private final DeckRepository deckRepository;

    /**
     * Конструктор для ініціалізації {@link DeckService} з ін'єкцією {@link DeckRepository}.
     *
     * @param deckRepository репозиторій для роботи з колодами карт
     */
    @Autowired
    public DeckService(DeckRepository deckRepository) {
        this.deckRepository = deckRepository;
    }

    /**
     * Повертає список всіх колод.
     *
     * @return список всіх колод
     */
    public List<Deck> getAllDecks() {
        return deckRepository.findAll();
    }


    /**
     * Повертає список колод за ім'ям та ідентифікатором користувача.
     * (Зараз використовує метод для пошуку лише за ідентифікатором користувача, не за ім'ям.)
     *
     * @param confirmationCode ідентифікатор користувача
     * @return список колод, що відповідають пошуку
     */
    public List<Deck> getDecksByConfirmationCode(String confirmationCode) {
        return deckRepository.findByConfirmationCode(confirmationCode);
    }

    /**
     * Повертає колоду за її ідентифікатором.
     *
     * @param id ідентифікатор колоди
     * @return Optional з колодою або пустий Optional, якщо колоду не знайдено
     */
    public Optional<Deck> getDeckById(String id) {
        return deckRepository.findById(id);
    }

    /**
     * Зберігає нову або оновлену колоду.
     *
     * @param deck об'єкт колоди для збереження
     * @return збережена колода
     */
    public Deck saveDeck(Deck deck) {
        return deckRepository.save(deck);
    }

    /**
     * Видаляє колоду за її ідентифікатором.
     *
     * @param id ідентифікатор колоди для видалення
     */
    public void deleteDeck(String id) {
        deckRepository.deleteById(id);
    }


    public void saveOrUpdateDeck(DeckDTO dto) {
        Optional<Deck> optionalDeck = deckRepository.findById(dto.getId());

        if (optionalDeck.isPresent()) {
            Deck existing = optionalDeck.get();
            if (dto.getUpdatedAt().isAfter(existing.getUpdatedAt())) {
                existing = new Deck(dto);
//                existing.setName(dto.getName());
//                existing.setUpdatedAt(dto.getUpdatedAt());
//                existing.setCreatedAt(dto.getCreatedAt());
                deckRepository.save(existing);
            }
        } else {
            Deck newDeck = new Deck(dto);
//            newDeck.setId(dto.getId());
//            newDeck.setName(dto.getName());
//            newDeck.setUpdatedAt(dto.getUpdatedAt());
//            newDeck.setCreatedAt(dto.getCreatedAt());
            deckRepository.save(newDeck);
        }
    }
}
