package org.example.spring_react_postg.controller;

import org.example.spring_react_postg.security.service.DeckService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserDataController {

    //TODO: create a model, service, repository for statistics
//    private final DeckService deckService;
//    private final NoteService noteService;
//    private final StatisticsService statisticsService;
//
//    public UserDataController(DeckService deckService, NoteService noteService, StatisticsService statisticsService) {
//        this.deckService = deckService;
//        this.noteService = noteService;
//        this.statisticsService = statisticsService;
//    }

    //TODO: create API to get all user's data(decks, cards, notes and statistics)
    @GetMapping("/data")
    public ResponseEntity<?> getUserData() {

        return null;
    }
}

