package org.example.spring_react_postg.mapper;

import org.example.spring_react_postg.model.Card;
import org.example.spring_react_postg.model.DTO.CardDTO;
import org.springframework.stereotype.Component;


import java.util.List;
import java.util.stream.Collectors;

@Component
public class CardMapper {

    public CardDTO toDTO(Card card) {
        CardDTO dto = new CardDTO();
        dto.setId(card.getId());
        dto.setDeckId(card.getDeckId());
        dto.setFront(card.getFront());
        dto.setBack(card.getBack());
        dto.setFlag(card.getFlag());
        dto.setEndDate(card.getEndDate());
        dto.setDaysJump(card.getDaysJump());
        dto.setEase(card.getEase());
        dto.setUpdatedAt(card.getUpdatedAt());
        dto.setLapses(card.getLapses());
        dto.setReviews(card.getReviews());
        dto.setNotes(card.getNotes());
        return dto;
    }

    public List<CardDTO> toDTOList(List<Card> cards) {
        return cards.stream().map(this::toDTO).collect(Collectors.toList());
    }
}

