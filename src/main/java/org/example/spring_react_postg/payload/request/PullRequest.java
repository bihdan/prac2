package org.example.spring_react_postg.payload.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.example.spring_react_postg.model.DTO.DeckUpdateDTO;

import java.time.Instant;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
public class PullRequest {

    private List<DeckUpdateDTO> decks;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Instant updatedAt;

    public List<DeckUpdateDTO> getDecks() {
        return decks;
    }

    public void setDecks(List<DeckUpdateDTO> decks) {
        this.decks = decks;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return  "\nPullRequest{ \n" +
                "decks:" + decks +
                "\n, statUpdatedAt='" + updatedAt + '\'' +
                "}\n";
    }
}
