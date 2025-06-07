import { useState, useEffect, useRef  } from "react";
import "./StudyBox.css";
import back_icon from "../../assets/back-icon.png"
import trianle_icon from "../../assets/trianle-icon.png"

function StudyBox({ selectedDeckId, deckStats, decks, cards, setActivity }) {
  
  const [isSetting, setIsSetting] = useState(false);
  const [isStudying, setIsStudying] = useState(false);

  const [includeNew, setIncludeNew] = useState(false);
  const [includeNewAlt, setIncludeNewAlt] = useState(false);
  const [includeFamiliar, setIncludeFamiliar] = useState(false);
  const [includeDue, setIncludeDue] = useState(false);


  const [selectedNewDates, setSelectedNewDates] = useState({});
  const [selectedFamiliarDates, setSelectedFamiliarDates] = useState({});
  const [selectedDueDates, setSelectedDueDates] = useState({});

  const [checkedNewDates, setCheckedNewDates] = useState({});
  const [checkedFamiliarDates, setCheckedFamiliarDates] = useState({});
  const [checkedDueDates, setCheckedDueDates] = useState({});

  const [queueOfNew, setQueueOfNew] = useState([]);
  const [queueOfFamiliar, setQueueOfFamiliar] = useState([]);
  const [queueOfDue, setQueueOfDue] = useState([]);

  const [queueDateAndcountOfNew, setQueueDateAndcountOfNew] = useState([]);
  const [queueDateAndcountOfFamiliar, setQueueDateAndcountOfFamiliar] = useState([]);
  const [queueDateAndcountOfDue, setQueueDateAndcountOfDue] = useState([]);



  const [deck, setDeck] = useState(null);
  const [stats, setStats] = useState(null);

  const [index, setIndex] = useState(0);
  const [studyQueue, setStudyQueue] = useState(null);
  const [currentCard, setCurrentCard]  = useState(null);

  const [isBackShown, setIsBackShown]  = useState(null);
  
  const [startStudy, setStartStudy]  = useState(null);
  const [endStudy, setEndStudy]  = useState(null);

  const [newExpantion, setNewExpantion] = useState(false);
  const [familiarExpantion, setFamiliarExpantion] = useState(false);
  const [dueExpantion, setDueExpantion] = useState(false);

  const toggleDate = (date) => {
    const newSelected = { ...selectedNewDates, [date]: !selectedNewDates[date] };
    setSelectedNewDates(newSelected);

    // якщо хоч один false → відключаємо expansion
    const allChecked = Object.values(newSelected).every(v => v);
    if (!allChecked) {
      setIncludeNew(false); // або setNewExpantion(false) якщо бажано
    }
  };
  
  
  const parentCheckboxRef = useRef(null);

  useEffect(() => {
    if (!parentCheckboxRef.current) return;

    const allDates = Object.keys(queueDateAndcountOfNew);
    const selectedDates = Object.keys(selectedNewDates);

    if (allDates.length === 0 || selectedDates.length === 0) {
      parentCheckboxRef.current.indeterminate = false;
      parentCheckboxRef.current.checked = false;
    } else if (selectedDates.length === allDates.length) {
      parentCheckboxRef.current.indeterminate = false;
      parentCheckboxRef.current.checked = true;
    } else {
      parentCheckboxRef.current.indeterminate = true;
      parentCheckboxRef.current.checked = false;
    }
  }, [selectedNewDates, queueDateAndcountOfNew]);


  
  useEffect(() => {
    const handleBeforeUnload = () => {
      const end = Date.now();
      if (startStudy !== null) {
        const durationSeconds = Math.floor((end - startStudy) / 1000);
        if (durationSeconds > 600) {
          updateStudyTime(60);
        } else {
          updateStudyTime(durationSeconds);
        }
      }
      
      
      
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [startStudy]);

  useEffect(() => {
    if (selectedDeckId) {
      setIsSetting(true);
      setDeck(decks?.find(d => d.id === selectedDeckId));
      setStats(deckStats?.[selectedDeckId] || { new: 0, familiar: 0, due: 0 });

      for (const card of cards) {

        if (card.deckId !== selectedDeckId) continue;

        if (card.daysJump === -1) {
          queueOfNew.push({ ...card});
          continue;
        }

        if (card.daysJump === 0) {
          queueOfFamiliar.push({ ...card});
          continue;
        }

        if (typeof card.daysJump === "number" &&
            card.daysJump >= 0 &&
            card.endDate &&
            new Date(card.endDate) <= now) {
          queueOfDue.push({ ...card});
          continue;
        }

      }

      const countByDate = queueOfNew.reduce((acc, card) => {
        acc[card.createdAt.slice(0, 10)] 
        = (acc[card.createdAt.slice(0, 10)] || 0) + 1;
        return acc;
      }, {});
      
      setQueueDateAndcountOfNew(countByDate);

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
      

      if (includeNew && isNew && se) {
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

    incrementReviewedStatToday();

  };

  function incrementReviewedStatToday() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    console.log(today);

    setActivity(prev => {
      const now = Date.now();
      const modifiedAt = new Date(now).toISOString();
      
      const updated = {
        ...prev,
        [today]: {
          added: prev[today]?.added || 0,
          reviewed: (prev[today]?.reviewed || 0) + 1,
          time: prev[today]?.time || 0,
          unsynchronised: -1,
          modifiedAt : modifiedAt,
          updatedAt: prev[today]?.updatedAt || null
        }
      };

      localStorage.setItem("activity", JSON.stringify(updated));
      return updated;
    });

  }

  function updateStudyTime(duration) {
    const today = new Date().toISOString().slice(0, 10);
    setActivity(prev => {
      //const prevDay = prev[today] || { added: 0, reviewed: 0, time: 0 };

      const now = Date.now();
      const modifiedAt = new Date(now).toISOString();

      const updated = {
        ...prev,
        [today]: {
          added: (prev[today]?.added || 0) + 1,
          reviewed: prev[today]?.reviewed || 0,
          time: (prev[today]?.time || 0) + duration,
          unsynchronised: -1,
          modifiedAt : modifiedAt,
          updatedAt: prev[today]?.updatedAt || null
        }
      };

      localStorage.setItem("activity", JSON.stringify(updated));
      return updated;
    });

  }



  return (
    <div className="studyBox oneOfMainBlock">

      {isSetting && ( 
        <div className="study-settings">
          <div className="deckHeader">
            <div className="deckNameContainer">
              <div 
              className="deckName"
              style={{maxWidth: 100 + "px"}}
              >{deck.name}</div>
            </div>

            <div className="cardTypesContainer">

              {/* Нові*/}
              <div className="cardTypeBlock">
                <div> 
                  <div 
                    className={`leftSpace ${stats.new > 0 ? "newCardsCounterBright" : "cardsCounter"}`}
                    
                    >
                    {stats.new}
                  </div>
                </div>
                <div className="newCardCheckboxesRow">

                  <div className="tooltip-wrapper">
                    <label>
                      <input
                        type="checkbox"
                        checked={includeNew}
                        onChange={() => {
                          const newValue = !includeNew;

                          setIncludeNew(newValue);
                          setIncludeNewAlt(newValue);
                          
                        }}
                      /> 
                    </label>
                    <div className="tooltip-text">Режим 1</div>  
                  </div>

                  <div className="tooltip-wrapper">
                    <label>
                      <input
                        type="checkbox"
                        /*className={`${!includeNewAlt? "inactive": ""} `}*/
                        checked={includeNewAlt}
                        onChange={() => setIncludeNewAlt(!includeNewAlt)}
                        disabled={!includeNew}
                      />
                    </label>
                    <div className="tooltip-text">Режим 1.1</div>  
                  </div>
                </div>






                <div className="expantionChech">
                  <div className="divForCheckbox">
                    <label>
                        <input
                        type="checkbox"
                        ref={parentCheckboxRef}
                        /*className={`${!includeNew? "inactive": ""} `}*/
                        disabled={!includeNew}
                        onChange={() => {
                          if (!newValue) {
                            setSelectedNewDates({});
                          } else {
                            // Увімкнути всі дати за замовчуванням
                            const allDates = {};
                            Object.keys(queueDateAndcountOfNew).forEach(date => {
                              allDates[date] = true;
                            });
                            setSelectedNewDates(allDates);
                          }
                        }}

                      />
                    </label>
                  </div>
                  <div className="divForTriange">
                    <img 
                      src={trianle_icon}
                      className={`back_button trianle_button ${!newExpantion ? "" : "rotate"} `}
                      
                      alt="Розширити вибір дат" 
                      onClick={() => {
                        newExpantion? setNewExpantion(false): setNewExpantion(true) ;

                      }}
                      role="button"

                      disabled={!includeNew}
                    />
                  </div>
                  {/*<button 
                    className={`back_button trianle_Fakebutton ${!newExpantion ? "" : "rotate"} `}
                    onClick={() => {
                      newExpantion? setNewExpantion(false): setNewExpantion(true) ;

                    }}
                    disabled={!includeNew}
                  >
                  ▷
                  </button>*/}
                  
                </div>
                <div 
                  className={`expantionOfDateBox  ${!newExpantion ? "hideDiv" : ""}`}
                  /*style={`${newExpantion ?  "visible: hidden" : ""}`}*/>

                  {Object.entries(queueDateAndcountOfNew).map(([date, count]) => (
                    <div 
                      /*className={`expantionDate ${!includeNew? "inactive": ""} `} */
                      className="expantionDate"
                      key={date}>
                        
                        <input
                          type="checkbox"
                          checked={selectedNewDates[date] || false}
                          onChange={() => toggleDate(date)}
                        />

                        <span className="dateDisplay">{date}</span>
                        <span className="dateCount">({count})</span>
                      </div>
                  ))}
                </div>
              </div>

              {/* Знайомі*/}
              <div className="cardTypeBlock">
                <div className={stats.familiar > 0 ? "learnedCardsCounterBright" : "learnedCardsCounter"}>
                  {stats.familiar}
                </div>
                

                <div className="tooltip-wrapper">
                  <label>
                    <input
                      type="checkbox"
                      checked={includeFamiliar}
                      onChange={() => setIncludeFamiliar(!includeFamiliar)}
                    />
                  </label>
                  <div className="tooltip-text">Режим 2</div>  
                </div>

                <div className="expantionChech">
                  <input
                    type="checkbox"
                    
                  />
                  <img 
                    src={trianle_icon}
                    className={`back_button trianle_button ${familiarExpantion ? "inactive" : ""}`}
                
                    alt="Розширити вибір дат" 
                    onClick={() => {
                      familiarExpantion? setFamiliarExpantion(false): setFamiliarExpantion(true) ;

                    }}
                    role="button"
                  />
                  
                </div>
                <div
                  className={`expantionOfDateBox  ${familiarExpantion ? "inactive" : ""}`}
                  /*style={`${newExpantion ?  "visible: hidden" : ""}`}*/>

                  {Object.entries(queueDateAndcountOfFamiliar).map(([date, count]) => (
                    <div className="expantionDate"  key={date}>
                        
                        <input
                          type="checkbox"
                          
                        />

                        <span className="dateDisplay">{date}</span>
                        <span>({count})</span>
                      </div>
                  ))}
                </div>
          
              </div>

              {/* для повторення */}
              <div className="cardTypeBlock">
                <div className={stats.due > 0 ? "dueCardsCounterBright" : "dueCardsCounter"}>
                  {stats.due}
                </div>
                

                <div className="tooltip-wrapper">
                  <label>
                    <input
                      type="checkbox"
                      checked={includeDue}
                      onChange={() => setIncludeDue(!includeDue)}
                    />
                  </label>
                  <div className="tooltip-text">Режим 3</div>  
                </div>

                <div className="expantionChech">
                  <input
                    type="checkbox"
                    
                  />
                  <img 
                    src={trianle_icon}
                    className={`back_button trianle_button ${!dueExpantion ? "inactive" : ""}`}
                
                    alt="Розширити вибір дат" 
                    onClick={() => {
                      dueExpantion? setDueExpantion(false): setDueExpantion(true) ;

                    }}
                    role="button"
                  />
                  
                </div>
                <div
                  className={`expantionOfDateBox  ${!dueExpantion ? "inactive" : ""}`}
                  /*style={`${newExpantion ?  "visible: hidden" : ""}`}*/>

                  {Object.entries(queueDateAndcountOfDue).map(([date, count]) => (
                    <div className="expantionDate"  key={date}>
                        
                        <input
                          type="checkbox"
                          
                        />

                        <span className="dateDisplay">{date}</span>
                        <span>({count})</span>
                      </div>
                  ))}
                </div>

              </div>
            </div>
          </div>


          <button 
          className="customButton"
          onClick={handleStartStudy}>
            Почати навчання
          </button>
        </div>
      )}

      {isStudying && (
        <div className="studySession">
  
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
