import { useState, useEffect } from "react";
import "./SyncButtons.css";
import {push} from "./syncService";

import push_icon from "../../assets/push_icon.png"
import pull_icon from "../../assets/pull_icon.png"

function SyncButtons ({decks, setDecks, cards, setCards }){

    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const unsyncedDecks = decks.some((d) => d.unsynchronised === -1);
        const unsyncedCards = cards.some((c) => c.unsynchronised === -1);
        setHasChanges(unsyncedDecks || unsyncedCards);
    }, [decks, cards]);
  
    const handlePush = async () => {
        setLoading(true);
        setMessage("Відправка...");

        try {
        // фільтрування і форматування об'єктів для відправки
        const decksToSync = decks
            .filter((d) => d.unsynchronised === -1)
            .map(({ 
                id, 
                name, 
                updated_at, 
                modified_at,
                created_at
            }) => ({
                id,
                name,
                updatedAt: modified_at, // з modified_at -> updated_at
                createdAt: created_at
            }));

        const cardsToSync = cards
            .filter((c) => c.unsynchronised === -1)
            .map(
            ({
                id,
                deckId,
                front,
                back,
                flag,
                daysJump,
                ease,
                endDate,
                lapses,
                reviews,
                notes,
                modifiedAt,
                updatedAt, // не передавати, але з modified_at -> updated_at
            }) => ({
                id,
                deckId,
                front,
                back,
                flag,
                daysJump,
                ease,
                endDate,
                lapses,
                reviews,
                notes,
                updatedAt: modifiedAt,
            })
            );

        // запит
        await push({ decks: decksToSync, cards: cardsToSync });

        // якщо успішно — оновлюємо локально
        const newDecks = decks.map((d) =>
            d.unsynchronised === -1
            ? {
                ...d,
                updated_at: d.modified_at,
                unsynchronised: null,
                }
            : d
        );

        const newCards = cards.map((c) =>
            c.unsynchronised === -1
            ? {
                ...c,
                updated_at: c.modified_at,
                unsynchronised: null,
                }
            : c
        );

        setDecks(newDecks);
        setCards(newCards);
        localStorage.setItem("decks", JSON.stringify(newDecks));
        localStorage.setItem("cards", JSON.stringify(newCards));
        setMessage("Синхронізовано успішно.");
        } catch (error) {
        console.error("Push error:", error);
        setMessage("Помилка синхронізації.");
        }

        setLoading(false);
    };

    return (
        <div className="syncButtons">
            <button 
                className={`pushButton ${hasChanges ? "hasChanges" : ""}`} 
                onClick={handlePush} disabled={loading}
                >
                Відправити
            </button>

            <img 
                src={push_icon}
                className={`image_button ${hasChanges ? "hasChanges" : ""}`}
                alt="Відправити" 
                onClick={handlePush}
                role="button"
            />

            <button className="pullButton">
                Отримати
            </button>

            <img 
                src={pull_icon}
                className={`image_button ${hasChanges ? "hasChanges" : ""}`}
                alt="Відправити" 
                onClick={handlePush}
                role="button"
            />
        </div>
    );
}

export default SyncButtons;