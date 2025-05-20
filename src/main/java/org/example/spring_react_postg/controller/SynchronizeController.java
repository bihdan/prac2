package org.example.spring_react_postg.controller;

import org.example.spring_react_postg.mapper.CardMapper;
import org.example.spring_react_postg.mapper.DeckMapper;
import org.example.spring_react_postg.model.Card;
import org.example.spring_react_postg.model.DTO.CardDTO;
import org.example.spring_react_postg.model.DTO.DeckDTO;
import org.example.spring_react_postg.model.DTO.DeckUpdateDTO;
import org.example.spring_react_postg.model.Deck;
import org.example.spring_react_postg.payload.request.PushRequestPullResponse;
import org.example.spring_react_postg.payload.request.PullRequest;
import org.example.spring_react_postg.repository.CardRepository;
import org.example.spring_react_postg.repository.DeckRepository;
import org.example.spring_react_postg.security.service.CardService;
import org.example.spring_react_postg.security.service.DeckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/sync")
public class SynchronizeController {
    @Autowired
    private DeckService deckService;

    @Autowired
    private CardService cardService;

    @Autowired
    private DeckRepository deckRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private DeckMapper deckMapper;

    @Autowired
    private CardMapper cardMapper;

    @PostMapping("/push")
    public ResponseEntity<?> pushDecksAndCards(@RequestBody PushRequestPullResponse request) {

        for (DeckDTO deckDTO : request.getDecks()) {
            deckService.saveOrUpdateDeck(deckDTO);
        }

        for (CardDTO cardDTO : request.getCards()) {
            cardService.saveOrUpdateCard(cardDTO);
        }

        return ResponseEntity.ok("Synchronization successful");
    }

    @PostMapping("/pull")
    public ResponseEntity<PushRequestPullResponse> pullDecksAndCards(@RequestBody PullRequest request) {
        List<DeckUpdateDTO> clientDecks = request.getDecks();

        // Отримати всі колоди з БД
        List<Deck> allServerDecks = deckRepository.findAll();
        Map<String, Deck> serverDeckMap = allServerDecks.stream()
                .collect(Collectors.toMap(Deck::getId, Function.identity()));

        // Мапа з айді -> час оновлення з клієнта
        Map<String, Instant> clientDeckMap = clientDecks.stream()
                .collect(Collectors.toMap(DeckUpdateDTO::getId, DeckUpdateDTO::getUpdatedAt));

        List<DeckDTO> decksToSend = new ArrayList<>();
        List<CardDTO> cardsToSend = new ArrayList<>();

        for (Deck serverDeck : allServerDecks) {
            String deckId = serverDeck.getId();
            Instant serverUpdatedAt = serverDeck.getUpdatedAt();
            Instant clientUpdatedAt = clientDeckMap.get(deckId);

            if (clientUpdatedAt != null) {
                // Колода існує і там, і там
                if (clientUpdatedAt.isBefore(serverUpdatedAt)) {
                    // На сервері новіша — додати Deck і лише ті Card, які новіші
                    decksToSend.add(deckMapper.toDTO(serverDeck));
                    List<Card> updatedCards = cardRepository
                            .findByDeckIdAndUpdatedAtBetween(deckId, clientUpdatedAt.plusNanos(1), serverUpdatedAt);
                    cardsToSend.addAll(cardMapper.toDTOList(updatedCards));
                }
            } else {
                // На клієнті її немає — треба надіслати всю колоду й усі її картки
                decksToSend.add(deckMapper.toDTO(serverDeck));
                List<Card> allCards = cardRepository.findByDeckId(deckId);
                cardsToSend.addAll(cardMapper.toDTOList(allCards));
            }
        }

        PushRequestPullResponse response = new PushRequestPullResponse();
        response.setDecks(decksToSend);
        response.setCards(cardsToSend);

        return ResponseEntity.ok(response);
    }

//    @PostMapping("/pull")
//    public ResponseEntity<PushRequestPullResponse> pullDecksAndCards(@RequestBody PullRequest request) {
//        List<DeckUpdateDTO> clientDecks = request.getDecks();
//
//
//        List<Deck> allServerDecks = deckRepository.findAll();
//        Map<String, Deck> serverDeckMap = allServerDecks.stream()
//                .collect(Collectors.toMap(Deck::getId, Function.identity()));
//
//
//        Map<String, Instant> clientDeckMap = clientDecks.stream()
//                .collect(Collectors.toMap(DeckUpdateDTO::getId, DeckUpdateDTO::getUpdatedAt));
//
//        List<DeckDTO> decksToSend = new ArrayList<>();
//        List<CardDTO> cardsToSend = new ArrayList<>();
//
//        for (Deck serverDeck : allServerDecks) {
//            String deckId = serverDeck.getId();
//            Instant serverUpdatedAt = serverDeck.getUpdatedAt();
//            Instant clientUpdatedAt = clientDeckMap.get(deckId);
//
//            if (clientUpdatedAt != null) {
//
//                if (clientUpdatedAt.isBefore(serverUpdatedAt)) {
//
//                    decksToSend.add(new DeckDTO(serverDeck));
//                    List<Card> updatedCards = cardRepository
//                            .findByDeckIdAndUpdatedAtBetween(deckId, clientUpdatedAt.plusNanos(1), serverUpdatedAt);
//                    cardsToSend.addAll( new CardDTO(updatedCards));
//                }
//            } else {
//                // На клієнті її немає — треба надіслати всю колоду й усі її картки
//                decksToSend.add(new DeckDTO(serverDeck));
//                List<Card> allCards = cardRepository.findByDeckId(deckId);
//                cardsToSend.addAll(CardMapper.toDTOList(allCards));
//            }
//        }
//
//        PushRequestPullResponse response = new PushRequestPullResponse();
//        response.setDecks(decksToSend);
//        response.setCards(cardsToSend);
//
//        return ResponseEntity.ok(response);
//    }

//    public List<CardDTO> toDTOList(List<Card> cards) {
//        return cards.stream().map(this::toDTO).collect(Collectors.toList());
//    }

}
