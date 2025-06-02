package org.example.spring_react_postg.payload.request;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.example.spring_react_postg.model.DTO.DeckUpdateDTO;

import java.time.Instant;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
public class PullRequest {

    private List<DeckUpdateDTO> decks;
    private Instant statUpdatedAt;

    public List<DeckUpdateDTO> getDecks() {
        return decks;
    }

    public void setDecks(List<DeckUpdateDTO> decks) {
        this.decks = decks;
    }

    public Instant getStatUpdatedAt() {
        return statUpdatedAt;
    }

    public void setStatUpdatedAt(Instant statUpdatedAt) {
        this.statUpdatedAt = statUpdatedAt;
    }
}
