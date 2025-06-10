package org.example.spring_react_postg.model.DTO;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.example.spring_react_postg.model.Card;

import java.time.Instant;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
public class CardDTO {
    private String id;
    private String deckId;
    private String front;
    private String back;
    private String flag;
    private LocalDate endDate;
    private Integer daysJump;
    private Integer ease;
    private Instant updatedAt;
    private Instant studiedAt;
    private Integer lapses;
    private Integer reviews;
    private String notes;

    public CardDTO (Card card) {
        this.id = card.getId();
        this.deckId = card.getDeckId();
        this.front = card.getFront();
        this.back = card.getBack();
        this.flag = card.getFlag();
        this.endDate = card.getEndDate();
        this.daysJump = card.getDaysJump();
        this.ease = card.getEase();
        this.updatedAt = card.getUpdatedAt();
        this.studiedAt = card.getStudiedAt();
        this.lapses = card.getLapses();
        this.reviews = card.getReviews();
        this.notes = card.getNotes();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDeckId() {
        return deckId;
    }

    public void setDeckId(String deckId) {
        this.deckId = deckId;
    }

    public String getFront() {
        return front;
    }

    public void setFront(String front) {
        this.front = front;
    }

    public String getBack() {
        return back;
    }

    public void setBack(String back) {
        this.back = back;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getDaysJump() {
        return daysJump;
    }

    public void setDaysJump(Integer daysJump) {
        this.daysJump = daysJump;
    }

    public Integer getEase() {
        return ease;
    }

    public void setEase(Integer ease) {
        this.ease = ease;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getStudiedAt() {
        return studiedAt;
    }

    public void setStudiedAt(Instant studiedAt) {
        this.studiedAt = studiedAt;
    }

    public Integer getLapses() {
        return lapses;
    }

    public void setLapses(Integer lapses) {
        this.lapses = lapses;
    }

    public Integer getReviews() {
        return reviews;
    }

    public void setReviews(Integer reviews) {
        this.reviews = reviews;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}

