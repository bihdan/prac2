import { useState, useEffect   } from "react";
import "./StudyBox.css";

function StudyBox({ selectedDeckId, deckStats, decks, cards }) {
  
  const [isSetting, setIsSetting] = useState(false);
  const [isStudying, setIsStudying] = useState(false);

  const [includeNew, setIncludeNew] = useState(false);
  const [includeNewAlt, setIncludeNewAlt] = useState(false);
  const [includeFamiliar, setIncludeFamiliar] = useState(false);
  const [includeDue, setIncludeDue] = useState(false);

  const [deck, setDeck] = useState(null);
  const [stats, setStats] = useState(null);
 
  useEffect(() => {
    if (selectedDeckId) {
      setIsSetting(true);
      setDeck(decks?.find(d => d.id === selectedDeckId));
      setStats(deckStats?.[selectedDeckId] || { new: 0, familiar: 0, due: 0 });
    }
  }, [selectedDeckId]);

  const handleStartStudy = () => {
    if (includeNew || includeNewAlt || includeFamiliar || includeDue) {
      const newQueue = generateStudyQueue(cards, {
        includeNew,
        includeFamiliar,
        includeDue
      });

      console.log(newQueue);

      //setStudyQueue(newQueue);
      setIsSetting(false);
      setIsStudying(true);
    } else {
      alert("Оберіть принаймні один тип карток для навчання.");
    }
  };

  const generateStudyQueue = (cards, options) => {
    const { includeNew, includeNewAlt, includeFamiliar, includeDue } = options;
    const now = new Date();


    const queue = [];

    for (const card of cards) {
      const isNew = card.daysJump === -1;
      const isFamiliar = card.daysJump === 0;
      const isDue =
        typeof card.daysJump === "number" &&
        card.daysJump >= 0 &&
        card.endDate &&
        new Date(card.endDate) <= now;
      

      if (includeNew && isNew) {
        queue.push({ ...card, dueInSession: true });
        continue;
      }

      if (includeNewAlt && (isNew || isFamiliar)) {
        queue.push({ ...card, dueInSession: true });
        continue;
      }

      if (includeFamiliar && isFamiliar) {
        queue.push({ ...card, dueInSession: true });
        continue;
      }

      if (includeDue && isDue) {
        queue.push({ ...card, dueInSession: true });
        continue;
      }
    }

    return queue;
  };

  const handleAnswer = (card, quality) => {
    const now = new Date();

    let intervalMinutes;
    switch (quality) {
      case "again":
        intervalMinutes = 10;
        card.ease = Math.max(1, card.ease - 1);
        card.lapses += 1;
        break;
      case "hard":
        intervalMinutes = 60;
        card.ease = Math.max(1, card.ease - 0.5);
        break;
      case "good":
        intervalMinutes = card.daysJump * 1440; // дні → хвилини
        card.ease += 0.5;
        break;
      case "easy":
        intervalMinutes = card.daysJump * 2 * 1440;
        card.ease += 1;
        break;
    }

    const nextReview = new Date(now.getTime() + intervalMinutes * 60 * 1000);
    card.endDate = nextReview.toISOString();
    card.updatedAt = now.toISOString();
    card.reviews += 1;
    card.dueInSession = false;

    // TODO: зберігати оновлення

  };

  return (
    <div className="studyBox">

      {isSetting && ( 
        <div className="study-settings">
          <div className="deckHeader">
            <div className="deckNameContainer">
              <div className="deckName">{deck.name}</div>
            </div>

            <div className="cardTypesContainer">
              
              
              
              {/* Нові*/}
              <div className="cardTypeBlock">
                <div 
                  className={`alignItems ${stats.new > 0 ? "newCardsCounterBright" : "newCardsCounter"}`}
                  
                  >
                  {stats.new}
                </div>
                <div className="newCardCheckboxesRow">

                  <div className="tooltip-wrapper">
                    <label>
                      <input
                        type="checkbox"
                        checked={includeNew}
                        onChange={() => setIncludeNew(!includeNew)}
                      /> 
                    </label>
                    <div className="tooltip-text">Режим 1</div>  
                  </div>
                  
                  
                  <label>
                    <input
                      type="checkbox"
                      checked={includeNewAlt}
                      onChange={() => setIncludeNewAlt(!includeNewAlt)}
                    />
                  </label>
                </div>
              </div>

              {/* Знайомі*/}
              <div className="cardTypeBlock">
                <div className={stats.familiar > 0 ? "learnedCardsCounterBright" : "learnedCardsCounter"}>
                  {stats.familiar}
                </div>
                <label>
                  <input
                    type="checkbox"
                    checked={includeFamiliar}
                    onChange={() => setIncludeFamiliar(!includeFamiliar)}
                  />
                </label>
              </div>

              {/* для повторення */}
              <div className="cardTypeBlock">
                <div className={stats.due > 0 ? "dueCardsCounterBright" : "dueCardsCounter"}>
                  {stats.due}
                </div>
                <label>
                  <input
                    type="checkbox"
                    checked={includeDue}
                    onChange={() => setIncludeDue(!includeDue)}
                  />
                </label>
              </div>
            </div>
          </div>


          <button onClick={handleStartStudy}>Почати навчання</button>
        </div>
      )}

      {isStudying && (
        <div className="study-session">

          {/* Навігація */}
          <button className="backButton" onClick={() => { setIsStudying(false); setIsSetting(true); }}>
            До налаштувань
          </button>
          <div className="cardDisplay">
            {/*console.log(generateStudyQueue(cards, [true, false, false, false]))*/}
            
          </div>

          {/* Вивід картки */}
          {/*currentCard && (
            <div className="cardDisplay">
              <div className="cardFront">
                {currentCard.front}
              </div>

              {isBackShown ? (
                <>
                  <div className="cardBack">
                    {currentCard.back}
                  </div>

                  <div className="responseButtons">
                    <button onClick={() => handleAnswer("again")}>Знову</button>
                    <button onClick={() => handleAnswer("hard")}>Важко</button>
                    <button onClick={() => handleAnswer("good")}>Добре</button>
                    <button onClick={() => handleAnswer("easy")}>Легко</button>
                  </div>
                </>
              ) : (
                <button className="showAnswerButton" onClick={() => setIsBackShown(true)}>
                  Показати відповідь
                </button>
              )}
            </div>
          )*/}

        </div>
      )}

    </div>
  );
}

export default StudyBox;
