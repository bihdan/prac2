import React from 'react';
import './BoxsByDecks.css'; // Підключи стилі, подібні до customTextForLabels і HBoxesForDesks

function BoxsByDecks({ decks, cards, deckStats, setDeckStats, onDeskClick}) { // , cardsCounter, onDeskClick 

  const renderedIds = new Set();

  return (
    <div className="boxesOfDeck ">
      {decks.map((deck) => {
        if (renderedIds.has(deck.id)) return null;
        renderedIds.add(deck.id);

        const stats = deckStats[deck.id] || { new: 0, familiar: 0, due: 0 };
        const { new: newCards, familiar: learnedCards, due: dueCards } = stats;
     
        return (
          <div key={deck.id} data-id={deck.id}
            className="nameAndCountersOfDeck"
            onClick={() => onDeskClick(deck.id)}>

            <div
              className="deckName">
              {deck.name}
            </div>

            <div className='counters'>
              <div className={newCards > 0 ? "newCardsCounterBright" : ""}>
                {newCards}
              </div>

              <div className={learnedCards > 0 ? "learnedCardsCounterBright" : ""}>
                {learnedCards}
              </div>

              <div className={dueCards > 0 ? "dueCardsCounterBright" : ""}>
                {dueCards}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
}

export default BoxsByDecks;
