package org.example.spring_react_postg.security.service;

import org.example.spring_react_postg.model.User;
import org.example.spring_react_postg.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Сервіс для управління користувачами.
 * Забезпечує операції з користувачами, такі як отримання користувачів за ID або ім'ям, а також збереження нових користувачів.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    AuthenticationManager authManager;

    /**
     * Конструктор сервісу користувачів.
     *
     * @param userRepository репозиторій для роботи з даними користувачів
     */
    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    /**
     * Повертає список всіх користувачів.
     *
     * @return список всіх користувачів
     */
    public List<User> getAllUsers() {
        return userRepository.findAllUsers();
    }

    /**
     * Повертає користувача за його унікальним ідентифікатором.
     *
     * @param id ідентифікатор користувача
     * @return {@link Optional} з користувачем, якщо знайдено, або порожній {@link Optional}, якщо не знайдено
     */
    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    /**
     * Повертає користувача за його ім'ям.
     *
     * @param username ім'я користувача (логін)
     * @return {@link Optional} з користувачем, якщо знайдено, або порожній {@link Optional}, якщо не знайдено
     */
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Зберігає нового користувача в базі даних.
     *
     * @param user об'єкт користувача для збереження
     * @return збережений користувач з присвоєним ID
     */
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public String verify(User user) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        System.out.print(authentication.isAuthenticated());
        if (authentication.isAuthenticated()) {
            return "success"; // jwtService.generateToken()  ;
        } else {
            return "fail";
        }
    }

//    public int findIdByUsername(String username){
//        User user = userRepository.findByUsername(username);
//        return
//    }
}
