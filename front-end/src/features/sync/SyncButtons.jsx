import { useState, useEffect } from "react";
import "./SyncButtons.css";
import {push, pull} from "./syncService";

import push_icon from "../../assets/push-icon.png"
import pull_icon from "../../assets/pull-icon.png"



function SyncButtons ({decks, setDecks, cards, setCards, activity, setActivity  }){

    const [hasChanges, setHasChanges] = useState(false);
    const [hasUpload, setHasUpload] = useState(false);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const unsyncedDecks = decks.some((d) => d.unsynchronised);
        const unsyncedCards = cards.some((c) => c.unsynchronised);
        setHasChanges(unsyncedDecks || unsyncedCards);
    }, [decks, cards]);
    


    const handlePush = async () => {
        setLoading(true);
        setMessage("Відправка...");

        try {
        // філь і форм об'єктів для відправки
            const decksToSync = decks
                .filter((d) => d.unsynchronised)
                .map(({ 
                    id, 
                    name, 
                    updatedAt, 
                    modifiedAt,
                    createdAt
                }) => ({
                    id,
                    name,
                    updatedAt: modifiedAt, // з modified_at -> updated_at
                    createdAt: createdAt
                }));

            const cardsToSync = cards
                .filter((c) => c.unsynchronised)
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
                        updatedAt,
                        createdAt
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
                        createdAt
                    })
                );
            
            const activityRaw =  activity; //JSON.parse(localStorage.getItem("activity") || "{}");
            const activityToSync = Object.fromEntries(
                Object.entries(activityRaw)
                    .filter(([_, value]) => value.unsynchronised)
                    .map(([date, value]) => [
                        date,
                        {
                            reviewed: value.reviewed,
                            added: value.added,
                            durationSeconds: value.time,
                            updatedAt: value.modifiedAt
                        }
                    ])
            );


            // запит
            await push({ 
                decks: decksToSync, 
                cards: cardsToSync,
                activity: activityToSync 
            });

            
            const newDecks = decks.map((d) =>
                d.unsynchronised
                ? {
                    ...d,
                    updated_at: d.modified_at,
                    unsynchronised: false,
                    }
                : d
            );

            const newCards = cards.map((c) =>
                c.unsynchronised
                ? {
                    ...c,
                    updated_at: c.modified_at,
                    unsynchronised: false,
                    }
                : c
            );
            
            const newActivity = { ...activityRaw };
            for (const [date, value] of Object.entries(newActivity)) {
                if (value.unsynchronised) {
                    newActivity[date] = {
                        ...value,
                        updatedAt: value.modifiedAt,
                        unsynchronised: false
                    };
                }
            }

            setDecks(newDecks);
            localStorage.setItem("decks", JSON.stringify(newDecks));

            setCards(newCards);
            localStorage.setItem("cards", JSON.stringify(newCards));

            setActivity(newActivity);
            localStorage.setItem("activity", JSON.stringify(newActivity));

            setMessage("Синхронізовано успішно.");
        } catch (error) {
            console.error("Push error:", error);
            setMessage("Помилка синхронізації.");
        }

        setLoading(false);
    };

    const handlePull = async () => {
        try {
            const localDecks = decks.map(deck => ({
                id: deck.id,
                updatedAt: deck.updatedAt
            }));

            let statUpdatedAt = null;

            for (const day in activity) {
                const updatedAt = activity[day]?.updatedAt;
                if (updatedAt) {
                    const updatedInstant = new Date(updatedAt);
                    if (!statUpdatedAt || updatedInstant > new Date(statUpdatedAt)) {
                        statUpdatedAt = updatedInstant.toISOString();
                    }
                }
            }

            console.log('localDecks:', localDecks);
            console.log('statUpdatedAt:', statUpdatedAt);

            const data = await pull({
                decks: localDecks,
                statUpdatedAt: statUpdatedAt
            });

            
            console.log('Отримано з сервера:', data);

            const newDecks = data.decks;
            const newCards = data.cards;

            /*await saveOrUpdateDecksAndCards(newDecks={newDecks}, newCards={newCards}, decks={decks}, cards={cards} );*/
        
            
            const deckMap = new Map(decks.map(deck => [deck.id, deck]));
            const cardMap = new Map(cards.map(card => [card.id, card]));

            newDecks.forEach(newDeck => {
                deckMap.set(newDeck.id, newDeck);
            });

            newCards.forEach(newCard => {
                cardMap.set(newCard.id, newCard);
            });

            
            const updatedDecks = Array.from(deckMap.values());
            const updatedCards = Array.from(cardMap.values());

            
            localStorage.setItem('decks', JSON.stringify(updatedDecks));
            localStorage.setItem('cards', JSON.stringify(updatedCards));

            
            decks.length = 0;
            cards.length = 0;
            decks.push(...updatedDecks);
            cards.push(...updatedCards);
        } catch (error) {
            console.error('Помилка при pull-синхронізації:', error);
        }
    };

    const saveOrUpdateDecksAndCards = async ({
        newDecks,
        newCards,
        decks,
        cards,
    }) => {
        
        const deckMap = new Map(decks.map(deck => [deck.id, deck]));
        const cardMap = new Map(cards.map(card => [card.id, card]));

        newDecks.forEach(newDeck => {
            deckMap.set(newDeck.id, newDeck);
        });

        newCards.forEach(newCard => {
            cardMap.set(newCard.id, newCard);
        });

        // Оновлені масиви
        const updatedDecks = Array.from(deckMap.values());
        const updatedCards = Array.from(cardMap.values());

        // Оновлюємо localStorage
        localStorage.setItem('decks', JSON.stringify(updatedDecks));
        localStorage.setItem('cards', JSON.stringify(updatedCards));

        setDecks(updatedDecks);
        setCards(updatedCards);
        // Також оновлюємо масиви, які були передані
        /*decks.length = 0;
        cards.length = 0;
        decks.push(...updatedDecks);
        cards.push(...updatedCards);*/
    };





    return (
        <div className="syncButtons">
            
            <img 
                src={push_icon}
                className={`image_button pushButton ${hasChanges ? " hasChanges" : ""}`}
                alt="Відправити" 
                onClick={handlePush}
                role="button"
            />
            
            <img 
                src={pull_icon}
                className={`image_button pullButton ${hasUpload ? " hasUpload" : ""}`}
                alt="Отримати" 
                onClick={handlePull}
                role="button"
            />

            
        </div>
    );
}

export default SyncButtons;