package org.example.spring_react_postg.model.DTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.example.spring_react_postg.model.Deck;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
public class DeckDTO {
    private String id;
    private String name;
    private Instant updatedAt;
    private Instant createdAt;


    public DeckDTO(Deck deck) {
        this.id = deck.getId();
        this.name = deck.getName();
        this.updatedAt = deck.getUpdatedAt();
        this.createdAt = deck.getCreatedAt();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

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

