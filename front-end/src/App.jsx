import { useState, useEffect  } from "react";
import "./App.css";

import SyncButtons from "./features/sync/SyncButtons"

import { login, signup, logout, autoLogin } from "./features/authAndForm/authService";
import LoginForm from "./features/authAndForm/LoginForm";

import CreatingBox from "./features/create/CreatingBox";

import DecksAndCounters from "./features/study/DecksAndCounters"
import StudyBox from "./features/study/StudyBox"

import BrowseBox from "./features/browse/BrowseBox"
import DetailsOfTheCard from "./features/browse/DetailsOfTheCard"



function App() {

  const [decks, setDecks] = useState(() => {
  const saved = localStorage.getItem("decks");
    return saved ? JSON.parse(saved) : [];
  });

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : [];
  });



  const [deckStats, setDeckStats] = useState({});

  useEffect(() => {
    const stats = {};

    decks.forEach(deck => {
      const filtered = cards.filter(card => card.deck_id === deck.id);
      stats[deck.id] = {
        new: filtered.filter(c => c.daysJump === -1).length,
        familiar: filtered.filter(c => c.daysJump === 0).length,
        due: filtered.filter(c => c.daysJump > 0 && new Date(c.dueDate) <= Date.now()).length,
      };
          
    });
    setDeckStats(stats);
  }, [decks, cards]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);


  const [username, setUsername] = useState(null);

  const [selectedDeckIdForStudy, setSelectedDeckIdForStudy] = useState(null);
  const handleDeckClick = (deckId) => {
    setSelectedDeckIdForStudy(deckId);
  };

  /*const [card, setCard] = useState(null);
  const handleCardClick = (cardId) => {
    //setCard(cardId);
    const selectedCard = cards.find((c) => c.id === cardId);
    if (selectedCard) {
      setCard(selectedCard);
    }
  };*/

  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const handleCardClick = (card) => {
    setFront(card.front || "");
    setBack(card.back || "");
  };


  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe");
    console.log("rememberMe =", rememberMe); // ✅

    if (rememberMe === "true") {
      console.log("🟡 Спроба авто-логіну...");

      autoLogin()
        .then((username) => {
          console.log("🟢 Успішний авто-логін. Користувач:", username);
          handleSuccess(username);
        })
        .catch((err) => {
          console.error("🔴 Авто-логін не вдався:", err);
          setShowLoginForm(true);
        })
        .finally(() => {
          console.log("⚪ Завершено перевірку авто-логіну.");
          setIsCheckingAuth(false);
        });
    } else {
      console.log("🟠 rememberMe не true. Показуємо форму.");
      setIsCheckingAuth(false);
      setShowLoginForm(true);
    }
  }, []);

  const handleSuccess = (username) => {
    setLoggedIn(true);
    setUsername(username);
    setShowLoginForm(false);

    if (!localStorage.getItem("decks")) {
      localStorage.setItem("decks", JSON.stringify([]));
    }
    if (!localStorage.getItem("cards")) {
      localStorage.setItem("cards", JSON.stringify([]));
    }
  };


  return (
    
    <div className="page">
      
      {/*isCheckingAuth && <div className="loading">Завантаження...</div>*/}

      {!isCheckingAuth && showLoginForm && (
        <div className="modal-overlay">
          <LoginForm  onSuccess={handleSuccess} />
        </div>
      )}

      {showLogoutWarning && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Підтвердження виходу</h3>
            <p>Після виходу дані з локальної бази (карти та колоди) буде видалено. Продовжити?</p>
            <div className="modal-buttons">
              <button
                onClick={async () => {
                  try {
                    await logout();
                  } catch (e) {
                    console.error("Logout failed", e);
                  } finally {
                    setLoggedIn(false);
                    setUsername("");
                    setShowLogoutWarning(false);
                    setShowLoginForm(true);

                    localStorage.removeItem("decks");
                    localStorage.removeItem("cards");
                    localStorage.removeItem("last_selected_deck");
                  }
                }}
              >
                Так, вийти
              </button>
              <button onClick={() => setShowLogoutWarning(false)}>Скасувати</button>
            </div>
          </div>
        </div>
      )}


      

      {/*showLoginForm && (                         // showLogin
        <div className="modal-overlay">
          <LoginForm  
          
          onSuccess={(username) => {
            setLoggedIn(true);
            setUsername(username);
            setShowLoginForm(false);

            if (!localStorage.getItem("decks")) {
              localStorage.setItem("decks", JSON.stringify([]));
            }
            if (!localStorage.getItem("cards")) {
              localStorage.setItem("cards", JSON.stringify([]));
            }
          }}
          
          />
        </div>
      )*/}

      {/* Header */}
      <header className="header">
        <div className="site-title">DCRepetify</div>
        <div className="user-info">
          <SyncButtons decks={decks} setDecks={setDecks} cards={cards} setCards={setCards}/>
          
          {loggedIn ? `Користувач: ${username}` : "Ви не авторизовані"}
          

          <button
            className="login-button"
            onClick={() => {
              if (loggedIn) {
                setShowLogoutWarning(true); // відкриває попередження
              } else {
                setShowLoginForm(!showLoginForm);
              }
            }}
          >
            {loggedIn ? "Вийти" : "Увійти"}
          </button>
          
        </div>
      </header>

      <main>

          <div className="main-box">
            
            
            
            <div className="layout">
              
              <DecksAndCounters decks={decks} cards={cards} deckStats={deckStats} setDeckStats={setDeckStats} onDeskClick={handleDeckClick}/>
              
              
              <div className="CreatingBoxInMain">
                <CreatingBox decks={decks} setDecks={setDecks} cards={cards} setCards={setCards} prevStats={deckStats} setDeckStats={setDeckStats}/>
              </div>
              
              <DetailsOfTheCard front={front} setFront={setFront} back={back} setBack={setBack}  />

              <div className="block">
                <StudyBox selectedDeckId={selectedDeckIdForStudy}/>
              </div>
              <div className="block">Блок 5</div>
              
              <BrowseBox cards={cards} setCards={setCards} decks={decks} handleCardClick={handleCardClick}/>
              
            </div>

          </div>

      </main>
      

      


      
      

    

    </div>
  );
}

export default App;
