package org.example.spring_react_postg;

import org.example.spring_react_postg.model.Deck;
import org.example.spring_react_postg.model.User;
import org.example.spring_react_postg.security.service.UserService;
import org.example.spring_react_postg.security.service.DeckService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private DeckService deckService;

    @Test
    public void printFromDBTest() {
        // Отримуємо всіх користувачів
        List<User> users = userService.getAllUsers();

        // Перевірка на порожній список
        if (users.isEmpty()) {
            System.out.println("Немає користувачів у базі даних.");
        } else {
            // Виводимо кожного користувача в консоль
            users.forEach(user -> {
                System.out.println("ID: " + user.getId() +
                        ", Username: " + user.getUsername() +
                        ", Email: " + user.getEmail() +
                        ", Created At: " + user.getCreatedAt());
            });
        }
    }

//    @Test
//    public void printDeckFromDBTest() {
//        // Отримуємо всіх користувачів
//        List<Deck> decks = deckService.getAllDecks();
//
//        // Перевірка на порожній список
//        if (decks.isEmpty()) {
//            System.out.println("Немає користувачів у базі даних.");
//        } else {
//            // Виводимо кожного користувача в консоль
//            decks.forEach(deck -> {
//                System.out.println("ID: " + deck.getId() +
//                        ", User: " + deck.getUser() +
//                        ", Name: " + deck.getName());
//            });
//        }
//    }
}
