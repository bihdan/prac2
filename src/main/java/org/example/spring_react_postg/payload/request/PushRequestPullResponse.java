package org.example.spring_react_postg.payload.request;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.example.spring_react_postg.model.DTO.CardDTO;
import org.example.spring_react_postg.model.DTO.DeckDTO;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
public class PushRequestPullResponse {
    private List<DeckDTO> decks;
    private List<CardDTO> cards;

    public List<DeckDTO> getDecks() {
        return decks;
    }

    public void setDecks(List<DeckDTO> decks) {
        this.decks = decks;
    }

    public List<CardDTO> getCards() {
        return cards;
    }

    public void setCards(List<CardDTO> cards) {
        this.cards = cards;
    }
}
