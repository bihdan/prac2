import { useState, useEffect, useMemo  } from "react";
import "./BrowseBox.css";

function BrowseBox({ cards, setCards, decks, handleCardClick }) {
    const [isSelectedCard, setIsSelectedCard] = useState(false);
    
    const flags = ["Red","Orange","Yellow","Green","Blue","Pink","Purple"];
    const types = ["New","Learn","Due"];

    const flagColors = {
        Red: "#ff4d4d",
        Orange: "#ffa500",
        Yellow: "#ffff66",
        Green: "#66ff66",
        Blue: "#66ccff",
        Pink: "#ff99cc",
        Purple: "#cc99ff",
    };


    const tags = Array.from(
        new Set(
        cards.flatMap((card) => card.tags || [])
        )
    );

    const filters = {
        decks: decks || [],
        flags,
        types,
        tags,
    };

    const deckIdToName = useMemo(() => {
        const map = {};
        decks.forEach(deck => {
            map[deck.id] = deck.name;
        });
        return map;
    }, [decks]);


    const cardType = (int) => {
        if (int === -1) return "Нова";
        if (int === 0) return "Проглянута";
        return "Вчиться";
    };

    
    

    return (
        <div className="browseContainer">
            <div className="filtersPanel">
                <div className="filterBlock">
                    
                    <div className="filterTopName">Колоди</div>
                    {/* Динамічний список колод */}
                    {filters.decks.map((deck) => (
                        <div key={deck.id} className="filterItem" >{deck.name}</div>
                    ))}
                </div>

                <div className="filterBlock">
                    <div className="filterTopName">Флаги</div>
                    {filters.flags.map((flag) => (
                        <div key={flag} className="filterItem">{flag}</div>
                    ))}
                </div>

                <div className="filterBlock">
                    <div className="filterTopName">Тип</div>
                    {filters.types.map((type) => (
                        <div key={type} className="filterItem">{type}</div>
                    ))}
                </div>

                <div className="filterBlock">
                    <div className="filterTopName">Теги</div>
                    {filters.tags.map((tag) => (
                        <div key={tag} className="filterItem">{tag}</div>
                    ))}
                </div>
            </div>

            <div className="cardsTable">
                <table>
                    <thead>
                        <tr>
                        <th>Перед</th>
                        <th>Колода</th>
                        <th>Термін</th>
                        <th>Тип</th>
                        <th>Флажок</th>
                        <th>Інтервал</th>
                        <th>Складність</th>
                        <th>Оновлено</th>
                        <th>Невдач</th>
                        <th>Переглядів</th>
                        <th>Записи</th>
                        <th>Створено</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map((card, index) => (
                        <tr key={card.id} style={{
                            backgroundColor: card.flag && flagColors[card.flag] ? flagColors[card.flag] : index % 2 === 0 ? "#3f3f3f" : "#2a2a2a" 
                            }}
                            //className={` ${frontError ? "input-error" : ""}`}
                            //onClick={handleSelectCard(card.id)}
                            onClick={() => handleCardClick(card)}
                            >
                            <td className="tableText" >{card.front}</td>
                            <td>{deckIdToName[card.deckId] || "—"}</td>
                            <td>{card.endDate || "—"}</td>
                            <td>{cardType(card.daysJump) || "—"}</td>
                            <td>{card.flag || "—"}</td>
                            <td>{card.daysJump}</td>
                            <td>{card.ease}</td>
                            <td>{card.updatedAt || "—"}</td> 
                            <td>{card.lapses}</td>
                            <td>{card.reviews}</td>
                            <td>{card.notes}</td>
                            <td>{new Date(card.createdAt).toLocaleDateString() || "—"}</td>
                            
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
        
    );

}

export default BrowseBox;