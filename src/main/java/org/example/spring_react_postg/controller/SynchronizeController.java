package org.example.spring_react_postg.controller;

import org.example.spring_react_postg.mapper.CardMapper;
import org.example.spring_react_postg.mapper.DeckMapper;
import org.example.spring_react_postg.model.*;
import org.example.spring_react_postg.model.DTO.CardDTO;
import org.example.spring_react_postg.model.DTO.DeckDTO;
import org.example.spring_react_postg.model.DTO.DeckUpdateDTO;
import org.example.spring_react_postg.payload.PushRequestPullResponse;
import org.example.spring_react_postg.payload.request.PullRequest;
import org.example.spring_react_postg.repository.CardRepository;
import org.example.spring_react_postg.repository.DeckRepository;
import org.example.spring_react_postg.repository.UserRepository;
import org.example.spring_react_postg.repository.UserStatsRepository;
import org.example.spring_react_postg.security.service.CardService;
import org.example.spring_react_postg.security.service.DeckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
    private UserRepository userRepository;

    @Autowired
    private DeckRepository deckRepository;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private UserStatsRepository userStatsRepository;

    @Autowired
    private DeckMapper deckMapper;

    @Autowired
    private CardMapper cardMapper;

    @PostMapping("/push")
    public ResponseEntity<?> pushDecksAndCards(@RequestBody PushRequestPullResponse request,
                                               Authentication authentication) {

        for (DeckDTO deckDTO : request.getDecks()) {
            deckService.saveOrUpdateDeck(deckDTO);
        }

        for (CardDTO cardDTO : request.getCards()) {
            if (cardDTO.isDeleted()) {
                cardRepository.deleteById(cardDTO.getId());
                continue;
            }

            cardService.saveOrUpdateCard(cardDTO);
        }


        if (request.getActivity() != null && !request.getActivity().isEmpty()) {
            String username = authentication.getName();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserStats stats = userStatsRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new RuntimeException("User stats not found"));

            Map<String, DailyStats> existing = stats.getActivity();
            Map<String, DailyStats> incoming = request.getActivity();

            for (Map.Entry<String, DailyStats> entry : incoming.entrySet()) {
                String date = entry.getKey();
                DailyStats newStats = entry.getValue();

                System.out.println(newStats);

                if (!existing.containsKey(date)) {
                    existing.put(date, newStats);
                } else {
                    DailyStats oldStats = existing.get(date);


                    oldStats.setReviewed(oldStats.getReviewed() + newStats.getReviewed());
                    oldStats.setAdded(oldStats.getAdded() + newStats.getAdded());
                    oldStats.setDurationSeconds(oldStats.getDurationSeconds() + newStats.getDurationSeconds());

                    if (newStats.getUpdatedAt() != null &&
                            (oldStats.getUpdatedAt() == null || newStats.getUpdatedAt().isAfter(oldStats.getUpdatedAt()))) {
                        oldStats.setUpdatedAt(newStats.getUpdatedAt());
                    }

                    existing.put(date, oldStats);

                }
            }

            stats.setActivity(existing);
            userStatsRepository.save(stats);
        }

        return ResponseEntity.ok("Synchronization successful");
    }

    @PostMapping("/pull")
    public ResponseEntity<PushRequestPullResponse> pullDecksAndCards(@RequestBody PullRequest request,
                                                                     Authentication authentication) {
        System.out.print(request);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal(); //берем юзера
        User user = userDetails.getUser();

        List<Deck> allUserDecks = deckRepository.findByConfirmationCode(user.getConfirmationCode());


        List<DeckUpdateDTO> clientDecks = request.getDecks();
        Map<String, Instant> clientDeckMap = clientDecks.stream()
                .collect(Collectors.toMap(DeckUpdateDTO::getId, DeckUpdateDTO::getUpdatedAt));


        List<DeckDTO> decksToSend = new ArrayList<>();
        List<CardDTO> cardsToSend = new ArrayList<>();

        for (Deck serverDeck : allUserDecks) {
            System.out.println(serverDeck);

            String deckId = serverDeck.getId();
            Instant serverUpdatedAt = serverDeck.getUpdatedAt();
            Instant clientUpdatedAt = clientDeckMap.get(deckId);

            if (clientUpdatedAt != null) {
                // Колода існує і там, і там
                if (clientUpdatedAt.isBefore(serverUpdatedAt)) {
                    // На сервері новіша — додати Deck і новіші Card
                    decksToSend.add(deckMapper.toDTO(serverDeck));
                    List<Card> updatedCards = cardRepository
                            .findByDeckIdAndUpdatedAtBetween(deckId, clientUpdatedAt.plusNanos(1), serverUpdatedAt);
                    cardsToSend.addAll(cardMapper.toDTOList(updatedCards));
                }
            } else {
                decksToSend.add(deckMapper.toDTO(serverDeck));
                List<Card> allCards = cardRepository.findByDeckId(deckId);
                cardsToSend.addAll(cardMapper.toDTOList(allCards));
            }
        }

        PushRequestPullResponse response = new PushRequestPullResponse();

        response.setDecks(decksToSend);
        response.setCards(cardsToSend);


        UserStats stats = userStatsRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("userStats not found"));


        Map<String, DailyStats> filtered;
        Instant statUpdatedAt = request.getUpdatedAt();

        if (statUpdatedAt == null) {

            filtered = stats.getActivity();
        } else {

            filtered = stats.getActivity().entrySet().stream()
                    .filter(entry -> entry.getValue().getUpdatedAt() != null &&
                            entry.getValue().getUpdatedAt().isAfter(statUpdatedAt))
                    .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        }

        response.setActivity(filtered);

        return ResponseEntity.ok(response);
    }

}
