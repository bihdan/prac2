import { useState, useEffect, useRef  } from "react";
import "./StudyBox.css";
import back_icon from "../../assets/back-icon.png"
import trianle_icon from "../../assets/trianle-icon.png"
import study_icon from "../../assets/study-icon.png"
import reveal_icon from "../../assets/reveal-icon.png"



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

  const [nextIntervalAgain, setNextIntervalAgain] = useState(null);
  const [nextIntervalHard, setNextIntervalHard] = useState(null);
  const [nextIntervalGood, setNextIntervalGood] = useState(null);
  const [nextIntervalEasy, setNextIntervalEasy] = useState(null);

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

  
  
  /*useEffect(() => {
    if (!includeNew) {
 
      setSelectedNewDates({});
      setIncludeNewAlt(false); // якщо треба — скидаємо режим 1.1
      parentCheckboxRef.current = false;
    }
  }, [includeNew]);*/
  
  const parentNewCheckboxRef = useRef(null);
  useEffect(() => {
    if (!parentNewCheckboxRef.current) return;
    if (!queueDateAndcountOfNew && !selectedNewDates) return;

    const allDates = Object.keys(queueDateAndcountOfNew);
    const selectedDates = Object.keys(selectedNewDates);

    console.log("selectedDates & allDates",selectedDates.length, allDates.length);
    
    if (allDates.length === 0 || selectedDates.length === 0) {
      parentNewCheckboxRef.current.indeterminate = false;
      parentNewCheckboxRef.current.checked = false;
    } else if (selectedDates.length === allDates.length) {
      parentNewCheckboxRef.current.indeterminate = false;
      parentNewCheckboxRef.current.checked = true;
    } else {
      parentNewCheckboxRef.current.indeterminate = true;
      parentNewCheckboxRef.current.checked = false;
    }
    console.log("indeterminate & checked",parentNewCheckboxRef.current.indeterminate, parentNewCheckboxRef.current.checked);

  }, [selectedNewDates, queueDateAndcountOfNew]);

  const parentFamiliarCheckboxRef = useRef(null);
  useEffect(() => {
    if (!parentFamiliarCheckboxRef.current) return;
    if (!queueDateAndcountOfFamiliar) return;
    if (!selectedFamiliarDates) return;

    const allDates = Object.keys(queueDateAndcountOfFamiliar);
    const selectedDates = Object.keys(selectedFamiliarDates);

    if (allDates.length === 0 || selectedDates.length === 0) {
      parentFamiliarCheckboxRef.current.indeterminate = false;
      parentFamiliarCheckboxRef.current.checked = false;
    } else if (selectedDates.length === allDates.length) {
      parentFamiliarCheckboxRef.current.indeterminate = false;
      parentFamiliarCheckboxRef.current.checked = true;
    } else {
      parentFamiliarCheckboxRef.current.indeterminate = true;
      parentFamiliarCheckboxRef.current.checked = false;
    }
    
  }, [selectedNewDates, queueDateAndcountOfNew]);

  const parentDueCheckboxRef = useRef(null);
  useEffect(() => {
    if (!parentDueCheckboxRef.current) return;
    if (!queueDateAndcountOfDue) return;
    if (!selectedDueDates) return;


    const allDates = Object.keys(queueDateAndcountOfDue);
    const selectedDates = Object.keys(selectedDueDates);

    if (allDates.length === 0 || selectedDates.length === 0) {
      parentDueCheckboxRef.current.indeterminate = false;
      parentDueCheckboxRef.current.checked = false;
    } else if (selectedDates.length === allDates.length) {
      parentDueCheckboxRef.current.indeterminate = false;
      parentDueCheckboxRef.current.checked = true;
    } else {
      parentDueCheckboxRef.current.indeterminate = true;
      parentDueCheckboxRef.current.checked = false;
    }
    
  }, [selectedNewDates, queueDateAndcountOfNew]);

  useEffect(() => {
    if (selectedDeckId) {
      setIsSetting(true);

      setQueueOfNew([]);
      setQueueOfFamiliar([]);
      setQueueOfDue([]);

      setQueueDateAndcountOfNew([]);
      setQueueDateAndcountOfFamiliar([]);
      setQueueDateAndcountOfDue([]);

      setSelectedNewDates({});
      setSelectedFamiliarDates({});
      setSelectedDueDates({});




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

      const newCountByDate = queueOfNew.reduce((acc, card) => {
        const temp = card.createdAt;
        console.log(temp);
        const sliced = temp.slice(0, 10); 
 
        acc[sliced] = (acc[sliced] || 0) + 1;
        return acc;
      }, {});
      setQueueDateAndcountOfNew(newCountByDate);

      const familiarCountByDate = queueOfNew.reduce((acc, card) => {
        if(!card.studiedAt) return;

        const temp = card.studiedAt;
        
        const sliced = new Date(card.studiedAt).toLocaleDateString().slice(0, 10);

        acc[sliced] = (acc[sliced] || 0) + 1;
        return acc;
      }, {});
      setQueueDateAndcountOfFamiliar(familiarCountByDate);

      const dueCountByDate = queueOfNew.reduce((acc, card) => {
        if(!card.endDate) return;
        
        const temp = card.endDate;
        //const sliced = temp.slice(0, 10);
        acc[temp] = (acc[temp] || 0) + 1;
        return acc;
      }, {});
      setQueueDateAndcountOfDue(dueCountByDate);

    }
  }, [selectedDeckId]);


  const toggleDate = (date, selectedDates, setSelectedDates) => { //setExpansion
    /*const newSelected = { ...selectedDates, [date]: !selectedDates[date] };
    setSelectedDates(newSelected);*/

    const newDates = { ...selectedDates };

    if (newDates[date]) {
      delete newDates[date]; 
    } else {
      newDates[date] = true;
    }

    setSelectedDates(newDates);
    /*const allChecked = Object.values(newSelected).every(v => v);
    if (!allChecked) {
      //setExpansion(false);
      expansion = false;
    }*/
  };

  const toggleParentCheckbox = (selectedDate, setSelectedDates, queueDateAndcount) => {
    const totalDates = Object.keys(queueDateAndcount).length;
    const selectedCount = Object.keys(selectedDate).length;

    const allSelected = selectedCount === totalDates;

    if (allSelected) {

      setSelectedDates({});
    } else {

      const allDates = {};
      Object.keys(queueDateAndcount).forEach(date => {
        allDates[date] = true;
      });
      setSelectedDates(allDates);
    }
  /*if (!parentRef.current) return;

    const isChecked = parentRef.current.checked;
    const isIndeterminate = parentRef.current.indeterminate;
    console.log(isChecked, isIndeterminate);
    if (isIndeterminate || isChecked) {
      // Зняти всі чекбокси (анчек)
      setSelectedDates({});
    } else {
      // Встановити всі чекбокси (чек)
      const allDates = {};
      Object.keys(queueDateAndcount).forEach(date => {
        allDates[date] = true;
      });
      console.log(allDates);
      setSelectedDates(allDates);
    }
    const allChecked = Object.values(newSelected).every(v => v);
    if (!allChecked) {
      //setExpansion(false);
      expansion = false;
    }*/
  };

  useEffect(() => {
    const handleBeforeUnload = () => {


      const end = Date.now();
      if (startStudy !== null) {
        updateStudyTime(calcStudyTime());
      }

      

    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [startStudy]);

  const handleStartStudy = () => {
    if ((includeNew && selectedNewDates.length !== 0) || (includeFamiliar && selectedFamiliarDates.length !== 0) || (includeDue && selectedDueDates.length !== 0)) {
      const newQueue = generateStudyQueue(cards, {
        includeNew,
        includeFamiliar,
        includeDue
      });

      if (newQueue.length === 0) {
        alert("Немає карток для навчання.");
        return;
      }

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
      
      if (card.deckId !== selectedDeckId) continue;

      const isFilteredDue =
        card.daysJump > 0 &&
        selectedDueDates[card.endDate];
        /*card.daysJump >= 0 &&
        card.endDate &&
        new Date(card.endDate) <= now*/

      if (includeDue && isFilteredDue) {
        queue.push({ ...card, dueInSession: true });
        continue;
      }

      
      const isFilteredFamiliar = card.daysJump === 0 && 
      selectedFamiliarDates[new Date(card.studiedAt).toLocaleDateString().slice(0, 10)];

      if (includeFamiliar && isFilteredFamiliar) {
        queue.push({ ...card, dueInSession: true });
        continue;
      }
      
      
      const isFilteredNew = card.daysJump === -1 && 
      selectedNewDates[card.createdAt.slice(0, 10)];



      if (includeNew && isFilteredNew) {
        queue.push({ ...card, dueInSession: true });
        continue;
      }

      if (includeNewAlt && (isNew || isFamiliar)) {
        queue.push({ ...card, dueInSession: true });
        continue;
      }


      
    }

    return queue;
  };

  const [startFrontTime, setStartFrontTime] = useState(null);
  const [startBackTime, setStartBackTime] = useState(null);
  const [totalStudyTime, setTotalStudyTime] = useState(0);

  useEffect(() => {
    if (currentCard) {
      const now = Date.now();
      setStartFrontTime(now);
      setStartBackTime(null);
    }
  }, [currentCard]);

  const handleReveal = () => {
    setIsBackShown(true);
    setStartBackTime(Date.now());

    setNextIntervalAgain(calcNextInterval(currentCard, "again").interval);
    setNextIntervalHard(calcNextInterval(currentCard, "hard").interval);
    setNextIntervalGood(calcNextInterval(currentCard, "good").interval);
    setNextIntervalEasy(calcNextInterval(currentCard, "easy").interval);
  };

  const calcNextInterval = (card, quality) => {
    let ease = card.ease || 2.5; // Початкове значення в Anki
    let interval = card.daysJump || 0;
    let lapses = card.lapses || 0;

    switch (quality) {
      case "again":
        lapses += 1;
        ease = Math.max(1.3, ease - 0.2);
        return {
          interval: 1,
          ease,
          lapses
        };

      case "hard":
        ease = Math.max(1.3, ease - 0.15);
        return {
          interval: Math.max(1, Math.round(interval * 1.2)),
          ease,
          lapses
        };

      case "good":
        return {
          interval: interval === 0 ? 1 : Math.round(interval * ease),
          ease,
          lapses
        };

      case "easy":
        ease += 0.15;
        return {
          interval: interval === 0 ? 3 : Math.round(interval * ease * 1.3),
          ease,
          lapses
        };

      default:
        return { interval, ease, lapses };
    }
  };




  const calcStudyTime = () => {
    const now = new Date();

    const frontDuration = Math.floor((startBackTime ? (startBackTime - startFrontTime) : (now - startFrontTime)) / 1000 ) ;
    
    const backDuration = Math.floor((startBackTime ? (now - startBackTime) : 0) / 1000 ) ;

    const total = (frontDuration > 600 ? 60 : frontDuration) 
    + (backDuration > 600 ? 60 : backDuration);

    return total;

  }

  const handleAnswer = (quality) => { // card, 

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

      setIsSetting(true); 
      alert("Навчання завершено!");
    }
    console.log(index, currentCard, studyQueue[nextIndex] );
    // TODO: зберігати оновлення

    incrementReviewedStatToday();

    updateStudyTime(calcStudyTime());

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
          durationSeconds: prev[today]?.time || 0,
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
          added: prev[today]?.added || 0,
          reviewed: prev[today]?.reviewed || 0,
          durationSeconds: (prev[today]?.time || 0) + duration,
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
        <div className="studySettings" >
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

                  <div className="divForCheckbox">

                    <div className="tooltip-wrapper">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox"
                          checked={includeNew}
                          disabled={stats.new === 0}
                          onChange={() => {
                            const newValue = !includeNew;

                            setIncludeNew(newValue);
                            //setIncludeNewAlt(newValue);
                            
                          }}
                        />
                        <span className="custom-checkbox"></span>
                      </label>

                      <div className="tooltip-text">Режим 1</div>  
                    </div>
                  </div>

                  <div className="divForCheckbox">

                    <div className="tooltip-wrapper">
                      <label className="checkbox-label">
                        <input 
                          type="checkbox"
                          /*className={`${!includeNewAlt? "inactive": ""} `}*/
                          checked={includeNewAlt}
                          onChange={() => setIncludeNewAlt(!includeNewAlt)}
                          disabled={!includeNew} 
                        />
                        <span className="custom-checkbox"></span>
                      </label>
                      <div className="tooltip-text">Режим 1.1</div>  
                    </div>
                  </div>
                </div>






                <div className="expantionCheck">
                  <div className="divForCheckbox">
                    <label className="checkbox-label">
                        <input 
                          type="checkbox"
                          ref={parentNewCheckboxRef}

                          disabled={!includeNew}

                          onChange={() => {
                            toggleParentCheckbox(

                              selectedNewDates, 
                              setSelectedNewDates, 
                              queueDateAndcountOfNew)
                            }
                          }
                          />
                        <span className="custom-checkbox"></span>
                    </label>
                  </div>
                  <div className="divForTriange">
                    <img 
                      src={trianle_icon}
                      className={`trianle_button ${!newExpantion ? "" : "rotate"} `}
                      
                      alt="Розширити вибір дат" 
                      onClick={() => {
                        newExpantion? setNewExpantion(false): setNewExpantion(true) ;

                      }}
                      role="button"

                    />
                  </div>
                  
                  
                </div>
                <div 
                  className={`expantionOfDateBox  ${!newExpantion ? "hidden" : "visible"}`}
                  /*style={`${newExpantion ?  "visible: hidden" : ""}`}*/>

                  {queueDateAndcountOfNew &&
                  Object.keys(queueDateAndcountOfNew).length > 0 &&
                  Object.entries(queueDateAndcountOfNew).map(([date, count]) => (
                    <div 
                      /*className={`expantionDate ${!includeNew? "inactive": ""} `} */
                      className="expantionDate"
                      key={date}
                    >
                      <div className="divForCheckbox">
                        <label className="checkbox-label">
                          <input 
                            type="checkbox"

                            checked={selectedNewDates[date] || false}

                            disabled={!includeNew}

                            onChange={() => toggleDate(date, selectedNewDates, setSelectedNewDates)} />
                          <span className="custom-checkbox"></span>
                        </label>
                      </div>


                      <span className="dateDisplay">{date.slice(2, 10)}</span>
                      <span className="dateDisplay dateCount">({count})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Знайомі*/}
              <div className="cardTypeBlock">
                <div className={stats.familiar > 0 ? "learnedCardsCounterBright" : "learnedCardsCounter"}>
                  {stats.familiar}
                </div>
                

                <div className="familiarCardCheckbox">
                  <div className="divForCheckbox">
                    <div className="tooltip-wrapper">
                    
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          disabled={stats.familiar === 0}
                          checked={includeFamiliar}
                          onChange={() => {
                              const newValue = !includeFamiliar;

                              setIncludeFamiliar(newValue);
                            }}
                        />
                        <span className="custom-checkbox"></span>
                      </label>

                      <div className="tooltip-text">Режим 2</div>  
                    </div>
                  </div>
                </div>

                <div className="expantionCheck">
                  <div className="divForCheckbox">
                    <label className="checkbox-label">
                        <input 
                          type="checkbox"
                          ref={parentFamiliarCheckboxRef}

                          disabled={!includeFamiliar}

                          onChange={() => {
                            toggleParentCheckbox(

                              selectedFamiliarDates, 
                              setSelectedFamiliarDates, 
                              queueDateAndcountOfFamiliar)
                            }
                          }
                          />
                        <span className="custom-checkbox"></span>
                    </label>
                  </div>

                  <div className="divForTriange">
                    <img 
                      src={trianle_icon}
                      className={`trianle_button ${!familiarExpantion ? "" : "rotate"} `}
                      
                      alt="Розширити вибір дат" 
                      onClick={() => {
                        familiarExpantion? setFamiliarExpantion(false): setFamiliarExpantion(true) ;

                      }}
                      role="button"

                    />
                  </div>

                  
                  
                </div>
                <div
                  className={`expantionOfDateBox  ${familiarExpantion ? "hidden" : "visible"}`}
                  /*style={`${newExpantion ?  "visible: hidden" : ""}`}*/>

                  {queueDateAndcountOfFamiliar &&
                  Object.keys(queueDateAndcountOfFamiliar).length > 0 &&
                  Object.entries(queueDateAndcountOfFamiliar).map(([date, count]) => (
                    <div className="expantionDate"  key={date}>
                        
                      <div className="divForCheckbox">
                        <label className="checkbox-label">
                          <input 
                            type="checkbox"

                            checked={selectedFamiliarDates[date] || false}

                            disabled={!includeFamiliar}

                            onChange={() => toggleDate(date, selectedFamiliarDates, setSelectedFamiliarDates)} />
                          <span className="custom-checkbox"></span>
                        </label>
                      </div>


                      <span className="dateDisplay">{date.slice(2, 10)}</span>
                      <span className="dateDisplay dateCount">({count})</span>
                        
                      
                    </div>
                  ))}
                </div>
          
              </div>

              {/* для повторення */}
              <div className="cardTypeBlock">
                <div className={stats.due > 0 ? "dueCardsCounterBright" : "dueCardsCounter"}>
                  {stats.due}
                </div>
                

                <div className="dueCardCheckbox">
                  <div className="divForCheckbox">
                    <div className="tooltip-wrapper">
                    
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          disabled={stats.due === 0}
                          checked={includeDue}
                          onChange={() => {
                              const newValue = !includeDue;

                              setIncludeDue(newValue);
                            }}
                        />
                        <span className="custom-checkbox"></span>
                      </label>

                      <div className="tooltip-text">Режим 3</div>  
                    </div>
                  </div>
                </div>

                <div className="expantionCheck">
                  <div className="divForCheckbox">
                    <label className="checkbox-label">
                        <input 
                          type="checkbox"
                          ref={parentDueCheckboxRef}

                          disabled={!includeDue}

                          onChange={() => {
                            toggleParentCheckbox(

                              selectedDueDates, 
                              setSelectedDueDates, 
                              queueDateAndcountOfDue)
                            }
                          }
                          />
                        <span className="custom-checkbox"></span>
                    </label>
                  </div>
                  <div className="divForTriange">
                    <img 
                      src={trianle_icon}
                      className={`trianle_button ${!dueExpantion ? "" : "rotate"} `}
                      
                      alt="Розширити вибір дат" 
                      onClick={() => {
                        dueExpantion? setDueExpantion(false): setDueExpantion(true) ;

                      }}
                      role="button"

                    />
                  </div>
                  
                  
                </div>
                <div
                  className={`expantionOfDateBox  ${!dueExpantion ? "hidden" : "visible"}`}
                  /*style={`${newExpantion ?  "visible: hidden" : ""}`}*/>

                  {queueDateAndcountOfDue &&
                  Object.keys(queueDateAndcountOfDue).length > 0 &&
                  Object.entries(queueDateAndcountOfDue).map(([date, count]) => (
                    <div className="expantionDate"  key={date}>
                        
                      <div className="divForCheckbox">
                        <label className="checkbox-label">
                          <input 
                            type="checkbox"

                            checked={selectedDueDates[date] || false}

                            disabled={!includeDue}

                            onChange={() => toggleDate(date, selectedDueDates, setSelectedDueDates)} />
                          <span className="custom-checkbox"></span>
                        </label>
                      </div>


                      <span className="dateDisplay">{date.slice(2, 10)}</span>
                      <span className="dateDisplay dateCount">({count})</span>
                        
                      
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>

          <div>
            <img
              src={study_icon}
              className="image_button"
              onClick={handleStartStudy}
              style={{height: 40 + "px", width: 40 + "px"}}
            />
          </div>   
          

        </div>
      )}

      {isStudying && (
        <div className="studySession">
  
          <div className="topBar">
            <img 
              src={back_icon}
              className="image_button " //back_button
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
              <div className="container" style={{width: 80 + "%", height: 100 + "%"}}> {/*cardDisplay 
                <div className="cardFront">
                  {currentCard.front}
                </div>
                
                                  
                  {/*<div className="cardBack">
                    {currentCard.back}
                  </div>*/}

                <div className="fakeInputWrapper">

                  <div
                    className="fake_input"
                    style={{width: 90 + "%"}}
                    suppressContentEditableWarning={true}
                  > 
                    {currentCard.front}
                  </div>

                </div>


                <div className="customLine"></div>

                {isBackShown && (
                  <div className="fakeInputWrapper">
                    <div
                      className="fake_input"
                      style={{width: 90 + "%"}}
                      suppressContentEditableWarning={true}
                    > 
                      {currentCard.back}
                    </div>
                  </div>
                )}
              </div>

              
            )}
          </div>



          <div className="controls">
            {currentCard && (
              isBackShown ? (

                <div className="responseButtons">
                  <div className="responseBlock">
                    <div className="nextIntervalDisplay">
                      ({nextIntervalAgain})
                    </div>

                    <button 
                    className="image_button " 
                    style={{ 
                    width: "auto", 
                    background: "var(--block-color)", 
                    borderColor: "var(--text-color)", 
                    color: "var(--text-color)" }} 
                    onClick={() => handleAnswer("again")}>Знову</button>
                  

                  </div>

                  <div className="responseBlock">
                    <div className="nextIntervalDisplay">
                      ({nextIntervalHard})
                    </div>
                    <button 
                      className="image_button " 
                      style={{ 
                      width: "auto", 
                      background: "var(--block-color)", 
                      borderColor: "var(--text-color)", 
                      color: "var(--text-color)" }} 
                      onClick={() => handleAnswer("hard")}>Важко</button>

                  </div>
                  
                  <div className="responseBlock">
                    <div className="nextIntervalDisplay">
                      ({nextIntervalGood})
                    </div>
                    <button 
                      className="image_button " 
                      style={{ 
                      width: "auto", 
                      background: "var(--block-color)", 
                      borderColor: "var(--text-color)", 
                      color: "var(--text-color)" }} 
                      onClick={() => handleAnswer("good")}>Добре</button>

                  </div>

                  <div className="responseBlock">
                    <div className="nextIntervalDisplay">
                      ({nextIntervalEasy})
                    </div>

                    <button 
                      className="image_button " 
                      style={{ 
                      width: "auto", 
                      background: "var(--block-color)", 
                      borderColor: "var(--text-color)", 
                      color: "var(--text-color)" }} 
                      onClick={() => handleAnswer("easy")}>Легко</button>
                  </div>
                </div>
              ) : (


                  <img 
                    src={reveal_icon}
                    className="image_button " //back_button
                    alt="Повернутися назад" 
                    onClick={handleReveal()}
                    role="button"
                  />
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default StudyBox;
