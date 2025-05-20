package org.example.spring_react_postg.mapper;

import org.example.spring_react_postg.model.DTO.DeckDTO;
import org.example.spring_react_postg.model.Deck;
import org.springframework.stereotype.Component;

@Component
public class DeckMapper {

    public DeckDTO toDTO(Deck deck) {
        DeckDTO dto = new DeckDTO();
        dto.setId(deck.getId());
        dto.setName(deck.getName());
        dto.setUpdatedAt(deck.getUpdatedAt());
        dto.setCreatedAt(deck.getCreatedAt());
        return dto;
    }

    public Deck toEntity(DeckDTO dto) {
        Deck deck = new Deck();
        deck.setId(dto.getId());
        deck.setName(dto.getName());
        deck.setUpdatedAt(dto.getUpdatedAt());
        deck.setCreatedAt(dto.getCreatedAt());
        return deck;
    }
}

