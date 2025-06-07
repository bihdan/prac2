import { useState, useEffect, useMemo  } from "react";
import "./BrowseBox.css";

import trianle_icon from "../../assets/trianle-icon.png"

import clock_icon from "../../assets/clock-icon.png"
/*import trianle_icon from "../../assets/trianle-icon.png"*/
import flag_icon from "../../assets/flag-icon.png"
import decks_icon from "../../assets/decks-icon.png"
import tag_icon from "../../assets/tag-icon.png"

function BrowseBox({ cards, setCards, decks, handleCardClick }) {
    const [isSelectedCard, setIsSelectedCard] = useState(false);
    
    const flags = ["Red","Orange","Yellow","Green","Blue","Pink","Purple"];
    const choices = ["Додано","Пройдено","Доступно","Змінено","Створено"];
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

    const todayChoices = {
        added: "Додано",
        learned: "Пройдено",
        due: "Доступно",
        edited: "Змінено",
        created: "Створено",
    };


    const tags = Array.from(
        new Set(
        cards.flatMap((card) => card.tags || [])
        )
    );

    const filters = {
        choices,
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



    const [deckExp, setDeckExp] = useState(true);
    const [flagExp, setFlagExp] = useState(true);
    const [typeExp, setTypeExp] = useState(true);
    const [tagExp, setTagExp] = useState(true);
    
    

    return (
        <div className="browseContainer oneOfMainBlock">
            <div className="filtersPanel">
                <div className="filterBlock">
                    <div className="triangleIconName">
                        <div className="divForTriange"
                        /*style={{width: 10 + "px", height: 10 + "px"}}*/>
                            <img 
                                src={trianle_icon}
                                className={` trianle_button ${!deckExp ? "" : "rotate"} `}
                                style={{width: 8 + "px", height: 8 + "px"}}
                                alt="Розширити вибір дат" 
                                onClick={() => {
                                deckExp? setDeckExp(false): setDeckExp(true) ;
        
                                }}
                                role="button"
        
                                /*disabled={!includeNew}*/
                            />
                        </div>

                        <div className="divForIcon"
                        /*style={{width: 10 + "px", height: 10 + "px"}}*/>
                            <img 
                                src={clock_icon}
                                className={` trianle_button ${!deckExp ? "" : "rotate"} `}
                                style={{width: 8 + "px", height: 8 + "px"}}
                                alt="Розширити вибір дат" 
                                onClick={() => {
                                deckExp? setDeckExp(false): setDeckExp(true) ;
        
                                }}
                                role="button"
        
                                /*disabled={!includeNew}*/
                            />
                        </div>

                        <div className="filterTopName">Сьогодні</div>

                    </div>
                    
                    <div className="itemsWrapper">
                        {filters.choices.map((choice) => (
                            <div key={choice} className="filterItem">{choice}</div>
                        ))}
                    
                    </div>
                </div>
                
                <div className="filterBlock">
                    <div className="triangleIconName">
                        <div className="divForTriange"
                        /*style={{width: 10 + "px", height: 10 + "px"}}*/>
                            <img 
                                src={trianle_icon}
                                className={` trianle_button ${!deckExp ? "" : "rotate"} `}
                                style={{width: 8 + "px", height: 8 + "px"}}
                                alt="Розширити вибір дат" 
                                onClick={() => {
                                deckExp? setDeckExp(false): setDeckExp(true) ;
        
                                }}
                                role="button"
        
                                /*disabled={!includeNew}*/
                            />
                        </div>

                        <div className="divForIcon"
                        /*style={{width: 10 + "px", height: 10 + "px"}}*/>
                            <img 
                                src={decks_icon}
                                className={` trianle_button ${!deckExp ? "" : "rotate"} `}
                                style={{width: 8 + "px", height: 8 + "px"}}
                                alt="Розширити вибір дат" 
                                onClick={() => {
                                deckExp? setDeckExp(false): setDeckExp(true) ;
        
                                }}
                                role="button"
        
                                /*disabled={!includeNew}*/
                            />
                        </div>

                        <div className="filterTopName">Колоди</div>

                    </div>
                    
                    <div className="itemsWrapper">
                        {filters.decks.map((deck) => (
                            <div 
                                key={deck.id} 
                                className="cutTextDisplay filterItem"
                                style={{}}
                            >
                                {deck.name}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="filterBlock">
                    <div className="triangleIconName">
                        <div className="divForTriange"
                        /*style={{width: 10 + "px", height: 10 + "px"}}*/>
                            <img 
                                src={trianle_icon}
                                className={` trianle_button ${!deckExp ? "" : "rotate"} `}
                                style={{width: 8 + "px", height: 8 + "px"}}
                                alt="Розширити вибір дат" 
                                onClick={() => {
                                deckExp? setDeckExp(false): setDeckExp(true) ;
        
                                }}
                                role="button"
        
                                /*disabled={!includeNew}*/
                            />
                        </div>

                        <div className="divForIcon"
                        /*style={{width: 10 + "px", height: 10 + "px"}}*/>
                            <img 
                                src={flag_icon}
                                className={` trianle_button ${!deckExp ? "" : "rotate"} `}
                                style={{width: 8 + "px", height: 8 + "px"}}
                                alt="Розширити вибір дат" 
                                onClick={() => {
                                deckExp? setDeckExp(false): setDeckExp(true) ;
        
                                }}
                                role="button"
        
                                /*disabled={!includeNew}*/
                            />
                        </div>

                        <div className="filterTopName">Флаги</div>

                    </div>
                    
                    <div className="itemsWrapper">
                    

                        {filters.flags.map((flag) => (
                            <div key={flag} className="filterItem">{flag}</div>
                        ))}
                               
                    </div>
                </div>

                <div className="filterBlock">

                    <div className="triangleIconName">
                        <div className="divForTriange"
                        /*style={{width: 10 + "px", height: 10 + "px"}}*/>
                            <img 
                                src={trianle_icon}
                                className={` trianle_button ${!deckExp ? "" : "rotate"} `}
                                style={{width: 8 + "px", height: 8 + "px"}}
                                alt="Розширити вибір дат" 
                                onClick={() => {
                                deckExp? setDeckExp(false): setDeckExp(true) ;
        
                                }}
                                role="button"
        
                                /*disabled={!includeNew}*/
                            />
                        </div>

                        <div className="divForIcon"
                        /*style={{width: 10 + "px", height: 10 + "px"}}*/>
                            <img 
                                src={tag_icon}
                                className={` trianle_button ${!deckExp ? "" : "rotate"} `}
                                style={{width: 8 + "px", height: 8 + "px"}}
                                alt="Розширити вибір дат" 
                                onClick={() => {
                                deckExp? setDeckExp(false): setDeckExp(true) ;
        
                                }}
                                role="button"
        
                                /*disabled={!includeNew}*/
                            />
                        </div>

                        <div className="filterTopName">Тип</div>

                    </div>

                    <div className="itemsWrapper">
                        {filters.types.map((type) => (
                            <div key={type} className="filterItem">{type}</div>
                        ))}
                    </div>
                </div>

                <div className="filterBlock">
                    <div className="triangleIconName">
                        <div className="divForTriange"
                        /*style={{width: 10 + "px", height: 10 + "px"}}*/>
                            <img 
                                src={trianle_icon}
                                className={` trianle_button ${!deckExp ? "" : "rotate"} `}
                                style={{width: 8 + "px", height: 8 + "px"}}
                                alt="Розширити вибір дат" 
                                onClick={() => {
                                deckExp? setDeckExp(false): setDeckExp(true) ;
        
                                }}
                                role="button"
        
                                /*disabled={!includeNew}*/
                            />
                        </div>

                        <div className="divForIcon"
                        /*style={{width: 10 + "px", height: 10 + "px"}}*/>
                            <img 
                                src={tag_icon}
                                className={` trianle_button ${!deckExp ? "" : "rotate"} `}
                                style={{width: 8 + "px", height: 8 + "px"}}
                                alt="Розширити вибір дат" 
                                onClick={() => {
                                deckExp? setDeckExp(false): setDeckExp(true) ;
        
                                }}
                                role="button"
        
                                /*disabled={!includeNew}*/
                            />
                        </div>

                        <div className="filterTopName">Теги</div>

                    </div>
                    <div className="itemsWrapper">
                        {filters.tags.map((tag) => (
                            <div key={tag} className="filterItem">{tag}</div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="searchAndTablePanel">
                <div className="searchBox">
                    <input
                        type="text"
                        className="searchInput"
                        placeholder='Seach cards type text and click away, for a advance seach use "deck:{deckName}".}'
                        /*value={back}*/
                        onChange={(e) => setBack(e.target.value)}
                        style={{padding: 5 + "px"}}
                    />
                    <hr style={{margin: 4 + "px"}}/>
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
                                <td 
                                    className="tableText" 
                                    style={{maxWidth: 200 +"px"}}
                                >
                                    {card.front}
                                </td>
                                <td className="tableText">{deckIdToName[card.deckId] || "—"}</td>
                                <td className="tableTextCenter">{card.endDate || "—"}</td>
                                <td className="tableText">{cardType(card.daysJump) || "—"}</td>
                                <td className="tableTextCenter">{card.flag || "—"}</td>
                                <td className="tableTextCenter">{card.daysJump}</td>
                                <td className="tableTextCenter">{card.ease}</td>
                                <td className="tableTextCenter">{card.updatedAt || "—"}</td> 
                                <td className="tableTextCenter">{card.lapses}</td>
                                <td className="tableTextCenter">{card.reviews}</td>
                                <td 
                                    className="tableText"
                                    style={{maxWidth: 100 +"px"}}
                                >
                                    {card.notes}
                                </td>
                                <td className="tableTextCenter">{new Date(card.createdAt).toLocaleDateString() || "—"}</td>
                                
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
        
    );

}

export default BrowseBox;