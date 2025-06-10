import { useState, useEffect, useRef } from "react";
import "./CreatingBox.css";
import flashdeck_icon from "../../assets/flash-deck.png"
import flashcard_icon from "../../assets/flash-card.png"

function CreatingBox({ decks, setDecks, cards, setCards, prevStats, setDeckStats, setActivity }) {

  const [deckName, setDeckName] = useState("");
  const [deckNameError, setDeckNameError] = useState(false);

  const [front, setFront] = useState("");
  const [frontError, setFrontError] = useState(false);

  const [back, setBack] = useState("");
  const [backError, setBackError] = useState(false);
  
  const [selectedDeck, setSelectedDeck] = useState("");

  const divFrontRef = useRef(null);
  const divBackRef = useRef(null);
  const divDeckNameRef = useRef(null);

  const clearText = (ref) => {
    if (ref.current) {
      ref.current.textContent = "";
    }
  };


  useEffect(() => {
    const lastDeckId = localStorage.getItem("last_selected_deck");
    if (lastDeckId && decks.some(deck => deck.id === lastDeckId)) {
      setSelectedDeck(lastDeckId);
    } else if (decks.length > 0) {
      setSelectedDeck(decks[0].id);
    }
  }, [decks]);


  const handleCreateCard = () => {

    if (!selectedDeck) {
      alert("Оберіть колоду");
      return;
    }

    const trimmedFront = front.trim();
    if (!trimmedFront) {
      setFrontError(true);
      return;
    }

    const trimmedBack = back.trim();

    {/*if (!trimmedFront || !trimmedBack) {
      alert("Обидві сторони картки не повинні бути пустими");
      return;
    }*/}

    const confirmationCode = getCookie("confirmation_code");
    const now = Date.now();
    const createdAt = new Date(now).toISOString(); //.now()
    const id = confirmationCode + "-" + now.toString();

    const newCard = {
      id,
      deckId: selectedDeck,

      front: trimmedFront,
      back: trimmedBack,

      flag: null,
      notes: "",

      endDate: null,
      daysJump: -1,
      ease: 10,
      
      lapses: 0,
      reviews: 0,
      
      unsynchronised: -1,
      modifiedAt : createdAt,
      updatedAt: null,
      createdAt: createdAt,
      studiedAt: null
    };

    localStorage.setItem("last_selected_deck", selectedDeck);

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));

    clearText(divFrontRef);
    clearText(divBackRef);

    setFront("");
    setBack("");

    setDeckStats(prevStats => {
      
      const updatedStats = { ...prevStats };
      if (!updatedStats[selectedDeck]) {
        updatedStats[selectedDeck] = { new: 1, familiar: 0, due: 0 };
      } else {
        updatedStats[selectedDeck].new += 1;
      }
      
      return updatedStats;
    });

    const deckDiv = document.querySelector(`[data-id="${selectedDeck}"]`);
    if (deckDiv) {
      const counter = deckDiv.querySelector(".newCardsCounter, .newCardsCounterBright");
      if (counter) {
        const current = parseInt(counter.textContent || "0", 10);
        counter.textContent = current + 1;
        counter.className = "newCardsCounterBright";
      }
    }

    incrementAddedStatToday();

  };

  const handleCreateDeck = () => {
    const trimmedName = deckName.trim();
    if (!trimmedName) {
      setDeckNameError(true);
      return;
    }

    const nameExists = decks.some(
      (deck) => deck.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (nameExists) {
      setDeckNameError(true);
      return;
    }

    const createdAt = Date.now();
    const confirmationCode = getCookie("confirmation_code");

    const newDeck = {
      id: confirmationCode + "-" + createdAt.toString(),
      name: trimmedName,

      color: "#242424",

      unsynchronised: -1,
      modifiedAt : createdAt,
      updatedAt: null,
      createdAt: createdAt
      
    };

    const updatedDecks = [...decks, newDeck];
    setDecks(updatedDecks);

    localStorage.setItem("decks", JSON.stringify(updatedDecks));
    
    clearText(divDeckNameRef);

    setDeckName("");
    
  };

  function incrementAddedStatToday() {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    console.log(today);

    setActivity(prev => {
      const now = Date.now();
      const modifiedAt = new Date(now).toISOString();

      const updated = {
        ...prev,
        [today]: {
          added: (prev[today]?.added || 0) + 1,
          reviewed: prev[today]?.reviewed || 0,
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



  

  return (
    <div className="CreatingBoxInMain ">

        
        {/* Створення картки */}
        <div className="creating-card oneOfMainBlock">
          <div className="top">
            <div className="top-text">Нова картка</div>

            <select 
            className="deck_select"
            value={selectedDeck}
            onChange={(e) => setSelectedDeck(e.target.value)}>
                
                {decks.map((deck) => (
                    <option key={deck.id} value={deck.id}>
                    {deck.name}
                    </option>
                ))}
            </select>

            <img 
                src={flashcard_icon}
                className="image_button"
                alt="Додати картку" 
                onClick={handleCreateCard}
                role="button"
            />
          </div>


          <div className="containers">

            
            <div className="container height30px">
              <div
                ref={divFrontRef}
                className={`fake_input ${frontError ? "input-error" : ""}`}

                
                onInput={(e) => setFront(e.currentTarget.textContent)}
                onFocus={() => setFrontError(false)}
                
                contentEditable
                suppressContentEditableWarning={true}
                
                data-placeholder={frontError ? "Поле не може бути порожнім" : "Передня сторона"}
                 
              />

            </div>
                
            
            <div className="container height30px">

              <div
                ref={divBackRef}
                className={`fake_input ${backError ? "input-error" : ""}`}

                onInput={(e) => setBack(e.currentTarget.textContent)}
                onFocus={() => setBackError(false)}

                contentEditable
                suppressContentEditableWarning={true}

                data-placeholder="Задня сторона"
                
              />

            </div>
      
        
      </div>

        </div>

        {/* kолоди */}
        <div className="creating-deck oneOfMainBlock">

          <div className="top">
              <div className="top-text">Нова колода</div>

              <img 
                  src={flashdeck_icon}
                  className="image_button"
                  alt="Додати картку" 
                  onClick={handleCreateDeck}
                  role="button"
              />
            </div>

            <div className="container height30px">

              <div

                ref={divDeckNameRef}
                className={`fake_input ${deckNameError ? "input-error" : ""}`}
                
                onInput={(e) => setDeckName(e.currentTarget.textContent)}
                onFocus={() => setDeckNameError(false)}

                contentEditable
                suppressContentEditableWarning={true}
 
                data-placeholder={deckNameError ? "Назва не може бути порожньою" : "Назва колоди"}
              />
                
            </div>

        </div>

    </div>
  );
}

export default CreatingBox;


function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}