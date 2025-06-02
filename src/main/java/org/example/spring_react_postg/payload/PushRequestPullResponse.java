package org.example.spring_react_postg.payload;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.example.spring_react_postg.model.DTO.CardDTO;
import org.example.spring_react_postg.model.DTO.DeckDTO;
import org.example.spring_react_postg.model.DailyStats;

import java.util.List;
import java.util.Map;

@NoArgsConstructor
@AllArgsConstructor
public class PushRequestPullResponse {
    private List<DeckDTO> decks;
    private List<CardDTO> cards;

    private Map<String, DailyStats> activity;

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

    public Map<String, DailyStats> getActivity() {
        return activity;
    }

    public void setActivity(Map<String, DailyStats> activity) {
        this.activity = activity;
    }
}
