package org.example.spring_react_postg.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.example.spring_react_postg.model.DTO.DeckDTO;

/**
 * Сутність {@code Deck} представляє колоду карт, яка належить певному користувачу.
 * Використовується для збереження даних у таблиці {@code deck} бази даних.
 */
@Entity
@Table(name = "deck")
@NoArgsConstructor
@AllArgsConstructor
public class Deck {


    /**
     * Унікальний ідентифікатор колоди.
     * Формат: {@code confirmationCode + "-" + createdAt.toString()}
     * Дозволяє визначити користувача, до якого належить колода.
     */
    @Id
    private String id;

    @Transient
    public String getConfirmationCode() {
        if (id != null && id.contains("-")) {
            return id.split("-")[0];
        }
        return null;
    }

    /**
     * Назва колоди.
     */
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Instant updatedAt;

    @Column(nullable = false)
    private Instant createdAt;

    public Deck(DeckDTO dto) {
        this.id = dto.getId();
        this.name = dto.getName();
        this.updatedAt = dto.getUpdatedAt();
        this.createdAt = dto.getCreatedAt();
    }

    /**
     * Повертає ідентифікатор колоди.
     *
     * @return ідентифікатор
     */
    public String getId() {
        return id;
    }

    /**
     * Встановлює ідентифікатор колоди.
     *
     * @param id ідентифікатор
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * Повертає назву колоди.
     *
     * @return назва
     */
    public String getName() {
        return name;
    }

    /**
     * Встановлює назву колоди.
     *
     * @param name назва
     */
    public void setName(String name) {
        this.name = name;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
