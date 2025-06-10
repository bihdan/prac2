package org.example.spring_react_postg.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.example.spring_react_postg.model.DTO.CardDTO;

/**
 * Сутність, що представляє навчальну картку (flashcard).
 * Картка прив'язана до {@link Deck} і містить поля для змісту, складності повторення, дати доступності тощо.
 */
@Entity
@Table(name = "card")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Card {

    /**
     * Унікальний ідентифікатор картки.
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


    @Column(nullable = false)
    private String deckId;


    /**
     * Текст на лицьовій стороні картки.
     */
    @Column(nullable = false)
    private String front;

    /**
     * Текст на зворотному боці картки.
     */
    @Column(nullable = true)
    private String back;

    /**
     * Індикатор, що позначає статус картки (наприклад, кольором або категорією).
     */
    @Column(nullable = true)
    private String flag;

    /**
     * Дата, після якої картку можна буде знову повторити.
     */
    @Column(nullable = true)
    private LocalDate endDate;

    /**
     * Кількість днів до наступного повторення картки.
     */
    @Column(nullable = false)
    private Integer daysJump;

    /**
     * Показник легкості для алгоритму інтервального повторення.
     * Визначає, як швидко збільшується інтервал між повтореннями.
     */
    @Column(nullable = false, columnDefinition = "int default 10")
    private Integer ease;

    @Column(nullable = false)
    private Instant updatedAt;

    @Column(nullable = true)
    private Instant studiedAt;

    @Column(nullable = false)
    private Integer lapses; // кількість помилок при навчанні- "again - 10"

    @Column(nullable = false)
    private Integer reviews; // кількість передглядів підчас навчання

    @Column(nullable = true)
    private String notes;


    public Card(CardDTO dto) {
        this.id = dto.getId();
        this.deckId = dto.getDeckId();
        this.front = dto.getFront();
        this.back = dto.getBack();
        this.flag = dto.getFlag();
        this.endDate = dto.getEndDate();
        this.daysJump = dto.getDaysJump();
        this.ease = dto.getEase();
        this.updatedAt = dto.getUpdatedAt();
        this.studiedAt = dto.getStudiedAt();
        this.lapses = dto.getLapses();
        this.reviews = dto.getReviews();
        this.notes = dto.getNotes();
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

    public void setUpdatedAt(Instant updated_at) {
        this.updatedAt = updated_at;
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
