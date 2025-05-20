package org.example.spring_react_postg.repository;

import org.example.spring_react_postg.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Репозиторій для управління користувачами в базі даних.
 * Забезпечує доступ до даних користувачів, а також підтримує основні CRUD операції.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    /**
     * Знаходить користувача за його ім'ям.
     *
     * @param username ім'я користувача (логін)
     * @return {@link Optional} з користувачем, якщо знайдено, або порожній {@link Optional}, якщо не знайдено
     */
    Optional<User> findByUsername(String username);


    Optional<User> findByConfirmationCode(String confirmationCode);



    /**
     * Повертає список усіх користувачів.
     *
     * @return список всіх користувачів
     */
    @Query("SELECT u FROM User u")
    List<User> findAllUsers();

    /**
     * Перевіряє, чи існує користувач з таким ім'ям.
     *
     * @param username ім'я користувача
     * @return {@code true}, якщо користувач з таким ім'ям існує, і {@code false} в іншому випадку
     */
    Boolean existsByUsername(String username);

    /**
     * Перевіряє, чи існує користувач з таким email.
     *
     * @param email email користувача
     * @return {@code true}, якщо користувач з таким email існує, і {@code false} в іншому випадку
     */
    Boolean existsByEmail(String email);
}
