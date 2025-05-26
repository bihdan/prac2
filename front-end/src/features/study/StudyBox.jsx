import { useState, useEffect   } from "react";
import "./StudyBox.css";
import back_icon from "../../assets/back-icon.png"

function StudyBox({ selectedDeckId, deckStats, decks, cards }) {
  
  const [isSetting, setIsSetting] = useState(false);
  const [isStudying, setIsStudying] = useState(false);

  const [includeNew, setIncludeNew] = useState(false);
  const [includeNewAlt, setIncludeNewAlt] = useState(false);
  const [includeFamiliar, setIncludeFamiliar] = useState(false);
  const [includeDue, setIncludeDue] = useState(false);

  const [deck, setDeck] = useState(null);
  const [stats, setStats] = useState(null);

  const [index, setIndex] = useState(0);
  const [studyQueue, setStudyQueue] = useState(null);
  const [currentCard, setCurrentCard]  = useState(null);

  const [isBackShown, setIsBackShown]  = useState(null);
  

 
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

      if (newQueue.length === 0) {
        alert("Немає карток для навчання.");
        return;
      }
    
      console.log(newQueue);

      setStudyQueue(newQueue);
      setIndex(0);
      setCurrentCard(newQueue[0]);

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

  const handleAnswer = (quality) => { // card, 
    const now = new Date();

    let intervalMinutes;

    switch (quality) {
    case "again":
      // ...
      break;
    case "hard":
      // ...
      break;
    case "good":
      // ...
      break;
    case "easy":
      // ...
      break;
    default:
      return;
  }

    /*const nextReview = new Date(now.getTime() + intervalMinutes * 60 * 1000);
    card.endDate = nextReview.toISOString();
    card.updatedAt = now.toISOString();
    card.reviews += 1;
    card.dueInSession = false;*/


    const nextIndex = index + 1;
    if (nextIndex < studyQueue.length) {
      setIndex(nextIndex);
      setCurrentCard(studyQueue[nextIndex]);
      setStudyQueue(studyQueue);
      setIsBackShown(false);
    } else {
      // Сесія завершена
      setStudyQueue([]);
      setCurrentCard(null);
      setIsStudying(false);
      alert("Навчання завершено!");
    }
    console.log(index, currentCard, studyQueue[nextIndex] );
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
        <div className="studySession">

          {/* Вивід картки */}
          {/*currentCard && (
            <div className="cardDisplay">
              <div className="cardFront">
                {currentCard.front}
              </div>

              <div className="cardBack">
                {isBackShown ? `${currentCard.back}` : ""}
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
          )
          
          
          
          .studyBox{
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: transparent;
  padding: 5px;

}

.deckHeader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 20px;
}

.deckNameContainer {
  display: flex;
  align-items: flex-start;
  flex: 1;
  
}

.cardTypesContainer {
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex: 3;
}

.cardTypeBlock {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.newCardCheckboxesRow {
  display: flex;
  flex-direction: row;
  gap: 8px;
}


.checkboxes {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
}

.back_button {
  width: 20px;
  height: 20px;
  padding: 4px;
  transition: border 0.3s, box-shadow 0.3s;

  align-self: flex-start;

}





*/}

          
          {/* Навігація */}
          <div className="topBar">
            <img 
              src={back_icon}
              className="back_button"
              alt="Повернутися назад" 
              onClick={() => {
                setIsStudying(false);
                setIsSetting(true); 
              }}
              role="button"
            />
          </div>


          <div className="cardContainer">
            {currentCard && (
              <div className="cardDisplay">
                <div className="cardFront">
                  {currentCard.front}
                </div>

                <hr></hr>

                {isBackShown && (
                  
                  <div className="cardBack">
                    {currentCard.back}
                  </div>
                )}
              </div>
            )}
          </div>



          <div className="controls">
            {currentCard && (
              isBackShown ? (
                <div className="responseButtons">
                  <button style={{ backgroundColor: 'red' }} onClick={() => handleAnswer("again")}>Знову</button>
                  <button style={{ backgroundColor: 'yellow', color: 'black'  }} onClick={() => handleAnswer("hard")}>Важко</button>
                  <button style={{ backgroundColor: 'green' }} onClick={() => handleAnswer("good")}>Добре</button>
                  <button style={{ backgroundColor: 'deepskyblue' }} onClick={() => handleAnswer("easy")}>Легко</button>
                </div>
              ) : (
                <button className="showAnswerButton" onClick={() => setIsBackShown(true)}>
                  Показати відповідь
                </button>
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default StudyBox;
