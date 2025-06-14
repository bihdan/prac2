import { useState, useEffect  } from "react";
import "./App.css";

import "./styles/base.css";
import "./styles/global.css";
import "./styles/helpers.css";

import SyncButtons from "./features/sync/SyncButtons"

import ThemeSelector from "./features/themeSelector/ThemeSelector";

import { login, signup, logout, autoLogin } from "./features/authAndForm/authService";
import LoginForm from "./features/authAndForm/LoginForm";

import CreatingBox from "./features/create/CreatingBox";

import DecksAndCounters from "./features/study/DecksAndCounters"
import StudyBox from "./features/study/StudyBox"

import BrowseBox from "./features/browse/BrowseBox"
import DetailsOfTheCard from "./features/browse/DetailsOfTheCard"

import StatisticBox from "./features/statistic/StatisticBox"

import enter_icon from "./assets/enter-icon.png"
import logout_icon from "./assets/logout-icon.png"

function App() {

  const [decks, setDecks] = useState(() => {
  const saved = localStorage.getItem("decks");
    return saved ? JSON.parse(saved) : [];
  });

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("cards");
    return saved ? JSON.parse(saved) : [];
  });

  const [activity, setActivity] = useState(() => {
    const saved = localStorage.getItem("activity");
    return saved ? JSON.parse(saved) : {};
  });

  const [deckStats, setDeckStats] = useState({});

  useEffect(() => {
    const stats = {};

    decks.forEach(deck => {
      const filtered = cards.filter(card => card.deckId === deck.id);
      stats[deck.id] = {
        new: filtered.filter(c => c.daysJump === -1).length,
        familiar: filtered.filter(c => c.daysJump === 0).length,
        due: filtered.filter(c => c.daysJump > 0 && new Date(c.dueDate) <= Date.now()).length,
      };

      //console.log(stats);
    });
    setDeckStats(stats);
  }, [decks, cards]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);


  const [username, setUsername] = useState(null);

  const [selectedDeckIdForStudy, setSelectedDeckIdForStudy] = useState(null);
  const [selectedDeckForStudy, setSelectedDeckForStudy] = useState(null);
  const [selectedStatsForStudy, setSelectedStatsForStudy] = useState(null);
  
  const handleDeckClick = (deckId) => {
    setSelectedDeckIdForStudy(deckId);
  };

  const [selectedDeckIdForDetails, setSelectedDeckIdForDetails] = useState(null);
  const handleCardClick = (card) => {
    setSelectedDeckIdForDetails(card.id);
  };

  
  const flagNameColors = {
    Red: {  name: "Червоний", color: "#ff4d4d" },
    Orange: { name: "Помаранчевий", color: "#ffa500" },
    Yellow: { name: "Жовтий", color: "#ffff66" },
    Green: { name: "Зелений", color: "#66ff66" },
    Blue: { name: "Синій", color: "#66ccff" },
    Pink: { name: "Рожевий", color: "#ff99cc" },
    Purple: { name: "Фіолетовий", color: "#cc99ff" },
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
    if (!localStorage.getItem("activity")) {
      localStorage.setItem("activity", JSON.stringify({}));
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
            <p>Після виходу дані з локальної бази буде видалено. Продовжити?</p>
            <div className="modal_buttons">
              <button
                className="customButton bgCBlockC shadowOnHover"
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
                    localStorage.removeItem("activity");
                    localStorage.removeItem("theme");

                    /*  TODO: hide or delete rendered objects*/ 
                  }
                }}
              >
                Так, вийти
              </button>
              <button 
                className="customButton shadowOnHover"
                onClick={() => setShowLogoutWarning(false)}>
                Скасувати
              </button>
              
            </div>
          </div>
        </div>
      )}


      {/* Header */}
      <header className="header">
        <div className="titleAndSelector">
          <ThemeSelector />

          <div className="site-title">DCRepetify</div>
        </div>

        <div className="user-info">
          <SyncButtons decks={decks} setDecks={setDecks} cards={cards} setCards={setCards} activity={activity} setActivity={setActivity} />
          
          {loggedIn ? `${username}` : "Ви не авторизовані"}
          

          <img 
            src={!loggedIn ? enter_icon : logout_icon} 
            alt=""
            className="image_button"
            onClick={() => {
              if (loggedIn) {
                setShowLogoutWarning(true);
              } else {
                setShowLoginForm(!showLoginForm);
              }
            }}
            role="button"
          />
          
        </div>
      </header>

      <main>

          <div className="main-box">
            <div className="layout">
              
              <DecksAndCounters decks={decks} cards={cards} deckStats={deckStats} setDeckStats={setDeckStats} onDeskClick={handleDeckClick}/>
              
              <CreatingBox decks={decks} setDecks={setDecks} cards={cards} setCards={setCards} prevStats={deckStats} setDeckStats={setDeckStats} setActivity={setActivity} />
              
              <DetailsOfTheCard cards={cards} setCards={setCards} decks={decks} flagNameColors={flagNameColors} selectedDeckIdForDetails={selectedDeckIdForDetails}  /> {/* front={front} setFront={setFront} back={back} setBack={setBack} */}

              <StudyBox selectedDeckId={selectedDeckIdForStudy} deckStats={deckStats} decks={decks} cards={cards} setActivity={setActivity} />
              
              <StatisticBox activity={activity} />
              
              <BrowseBox cards={cards} setCards={setCards} decks={decks} handleCardClick={handleCardClick} flagNameColors={flagNameColors} />
              
            </div>
          </div>

      </main>
      

      


      
      

    

    </div>
  );
}

export default App;
