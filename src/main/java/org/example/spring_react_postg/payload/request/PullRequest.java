package org.example.spring_react_postg.payload.request;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.example.spring_react_postg.model.DTO.DeckUpdateDTO;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
public class PullRequest {
    private List<DeckUpdateDTO> decks;

    public List<DeckUpdateDTO> getDecks() {
        return decks;
    }

    public void setDecks(List<DeckUpdateDTO> decks) {
        this.decks = decks;
    }
}
