import { useState } from "react";
import "./DecksAndCounters.css";
import BoxsByDecks from "./BoxsByDecks";
import StudyBox from "./StudyBox";

function DecksAndCounters({ decks, cards, deckStats, setDeckStats, onDeskClick}) {


return (
    
    <div className="boxForDecksDisplay oneOfMainBlock" id="boxForDecks">
        <div className="textAboveDecks">
            <div className="leftLabel">
                <span>Колода</span>
            </div>

            <div className="rightLabels">
                <div className="tooltip-wrapper">
                    <span>Нв</span>
                    <div className="tooltip-text">Нові</div>
                </div>
                <div className="tooltip-wrapper">
                    <span>Пргл</span>
                    <div className="tooltip-text">Проглянуті</div>
                </div>
                <div className="tooltip-wrapper">
                    <span>Знм</span>
                    <div className="tooltip-text">Знайомі</div>
                </div>  
            </div>
        </div>

        <div className="underline"></div>

        <hr></hr>


        <BoxsByDecks decks={decks} cards={cards} deckStats={deckStats} setDeckStats={setDeckStats} onDeskClick={onDeskClick}/>
    </div>

        


    
    
);

}


export default DecksAndCounters;