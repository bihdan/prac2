import { useState, useEffect } from "react";
import "./CreatingBox.css";
import flashdeck_icon from "../../assets/flash-deck.png"
import flashcard_icon from "../../assets/flash-card.png"

function CreatingBox({ decks, setDecks, cards, setCards, prevStats, setDeckStats }) {

  const [deckName, setDeckName] = useState("");
  const [deckNameError, setDeckNameError] = useState(false);

  const [front, setFront] = useState("");
  const [frontError, setFrontError] = useState(false);

  const [back, setBack] = useState("");
  const [backError, setBackError] = useState(false);
  

  const [selectedDeck, setSelectedDeck] = useState("");

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
      createdAt: createdAt
    };

    localStorage.setItem("last_selected_deck", selectedDeck);

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
    setFront("");
    setBack("");

    setDeckStats(prevStats => {
      console.log(prevStats);
      const updatedStats = { ...prevStats };
      if (!updatedStats[selectedDeck]) {
        updatedStats[selectedDeck] = { new: 1, familiar: 0, due: 0 };
      } else {
        updatedStats[selectedDeck].new += 1;
      }
      console.log(updatedStats);
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
    setDeckName("");
  };




  

  return (
    <div className="creating-deck-card-box">
      
      {/* Створення картки */}
      <div className="creating-card">
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

        <input
          type="text"
          value={front}
          onChange={(e) => setFront(e.target.value)}

          onFocus={() => setFrontError(false)}
          className={`text_side ${frontError ? "input-error" : ""}`}
          placeholder={frontError ? "Поле не може бути порожнім" : "Передня сторона"}
        />

        <input
          type="text"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          className="text_side"
          placeholder="Задня сторона"
        />

      </div>

      {/* Створення колоди */}
      <div className="creating-deck">

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

        <input
          type="text"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          onFocus={() => setDeckNameError(false)}
          className={`text_side ${deckNameError ? "input-error" : ""}`}
          placeholder={deckNameError ? "Назва не може бути порожньою" : "Назва колоди"}
        />

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