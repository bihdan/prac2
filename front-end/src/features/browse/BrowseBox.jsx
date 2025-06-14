import { useState, useEffect, useMemo  } from "react";
import "./BrowseBox.css";

import trianle_icon from "../../assets/trianle-icon.png"

import clock_icon from "../../assets/clock-icon.png"
/*import trianle_icon from "../../assets/trianle-icon.png"*/
import flag_icon from "../../assets/flag-icon.png"
import decks_icon from "../../assets/decks-icon.png"
import type_icon from "../../assets/type-icon.png"

import tag_icon from "../../assets/tag-icon.png"

function BrowseBox({ cards, setCards, decks, handleCardClick, flagNameColors }) {
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


    const [todayExp, setTodayExp] = useState(true);
    const [deckExp, setDeckExp] = useState(true);
    const [flagExp, setFlagExp] = useState(true);
    const [typeExp, setTypeExp] = useState(true);
    const [tagExp, setTagExp] = useState(true);


    const isToday = (stringDate) => {
        if (!stringDate) return false;
        const date = new Date(stringDate);
        const now = new Date();
        return (
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate()
        );
    };

    const [searchQuery, setSearchQuery] = useState('');

    const getFilteredCards = () => {
        const trimmed = searchQuery.trim();
        if (!trimmed) return cards;

        // "deck:English"
        const fieldRegex = /"([\w]+):([^"]+)"/g;
        const fieldFilters = {};
        let match;

        while ((match = fieldRegex.exec(trimmed)) !== null) {
            const key = match[1].toLowerCase();
            const value = match[2].toLowerCase();
            fieldFilters[key] = value;
        }

        // без "deck:English"
 
        const plainText = trimmed
            .replace(/"[\w]+:[^"]+"/g, '')
            .trim()
            .toLowerCase();

        return cards.filter(card => {
            if (fieldFilters.today) {
                const todayType = fieldFilters.today;
                switch (todayType) {
                    case "created":
                        if (!isToday(card.createdAt)) return false;
                        break;
                    case "edited":
                        if (!isToday(card.modifiedAt) || !isToday(card.updatedAt)) return false;
                        break;
                    case "due":
                        if (!isToday(card.endDate)) return false; 
                        break;
                    case "studied":
                        if (!isToday(card.studiedAt)) return false;
                        break;
                    case "added":
                        if (!isToday(card.createdAt)) return false;
                        break;
                    default:
                        break;
                }
            }
            
            
            if (fieldFilters.deck) {
                const deckName = deckIdToName[card.deckId]?.toLowerCase() || '';
                if (!deckName.includes(fieldFilters.deck)) return false;
            }

            if (fieldFilters.flag) {
                const flag = card.flag?.toLowerCase() || '';
                if (!flag.includes(fieldFilters.flag)) return false;
            }

            if (fieldFilters.type) {
                const type = card.type?.toLowerCase() || '';
                if (!type.includes(fieldFilters.type)) return false;
                switch (type) {
                    case "due":
                        if (!card.daysJump > 0) return false; //!card.endDate || new Date(card.endDate) > new Date()) return false;
                        break;
                    case "studied":
                        if (!!card.daysJump === 0) return false; // card.studiedAt > 0 && 
                        break;
                    case "added":
                        if (!card.daysJump === -1) return false;
                        break;
                    default:
                        break;
                }
            }

            if (fieldFilters.tag) {
                const tag = card.tag?.toLowerCase() || '';
                if (!tag.includes(fieldFilters.tag)) return false;
            }

            // === Звичайний пошук (по front, back, notes) ===
            if (plainText) {
                const combined = `${card.front} ${card.back} ${card.notes || ''}`.toLowerCase();
                if (!combined.includes(plainText)) return false;
            }

            return true;
        });
    };

    
    const FilterBlock = ({
        icon,
        triangleIcon,
        title,
        items,
        expanded,
        setExpanded,
        getItemKey,
        getItemLabel,
        getItemValue,
        onFilterClick,
        prefixKey,
    }) => {
        //console.log(items)

        return (
            
            <div className="filterBlock">
                <div className="triangleIconName">
                    <div className="divForTriange" onClick={() => setExpanded(!expanded)}>
                        <img
                            src={triangleIcon}
                            className={`trianle_button wh8 ${expanded ? "rotate" : ""}`}
                            alt={`Розгорнути ${title}`}
                            role="button"
                        />
                    </div>
                    <div className="divForIcon">
                        <img
                            src={icon}
                            className="filterIcon"
                            alt={title}
                            role="button"
                        />
                    </div>
                    <div className="filterTopName">{title}</div>
                </div>

                {expanded && (
                    <div className="itemsWrapper">
                        {items.map((item, index) => {
                            const key = getItemKey?.(item) ?? item.key ?? index;
                            const value = getItemValue?.(item) ?? item.key ?? item;
                            const label = getItemLabel?.(item) ?? item.label ?? item;

                            

                            /*const key = getItemKey ? getItemKey(item) : index;
                            const label = getItemLabel ? getItemLabel(item) : item;
                            
                            const value = getItemValue ? getItemValue(item) : item;*/

                            //console.log(key, value, label)
                            
                            return (
                                <div
                                    className="filterItemBlock"
                                    key={key}
                                    onClick={() => onFilterClick?.(`"${prefixKey}:${value}"`)}
                                >
                                    <div className="divForIcon">
                                        <img
                                            src={icon}
                                            className="filterIcon"
                                            alt={title}
                                            role="button"
                                        />
                                    </div>
                                    <div
                                        className={`ItemName ${
                                        prefixKey === "deck" ? "cutTextDisplay" : ""}`}
                                    >
                                        {label}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        );
    };

    const [filterExpanded, setFilterExpanded] = useState({
        /*choices: false,
        flags: false,
        decks: false,
        types: false,
        tags: false,*/
        
        choices: true,
        flags: true,
        decks: true,
        types: true,
        tags: true,
        
    });

    const todayChoices = {
        added: {key: "added", name: "Додано" },
        studied: {key: "studied", name: "Пройдено" },
        due: {key: "due", name: "Доступно" },
        edited: {key: "edited", name: "Змінено" },
        created: {key: "created", name: "Створено" },
    };

    const typeChoices = {
        added: { name: "Нова" },
        studied: { name: "Проглянута" },
        due: { name: "Знайома" },
    };


    /*const flagNameColors = [
        {Red: {name:"Червоний", color:"#ff4d4d"}},
        {Orange: {name:"Помаранчевий", color:"#ffa500"}},
        {Yellow: {name:"Жовтий", color:"#ffff66"}},
        {Green: { name:"Зелений", color:"#66ff66"}},
        {Blue: { name:"Синій", color:"#66ccff"}},
        {Pink: { name:"Рожевий", color:"#ff99cc"}},
        {Purple: { name:"Фіолетовий", color:"#cc99ff"}}
    ];

    const todayChoices = [
        {added: {name:"Додано"}},
        {studied: {name:"Пройдено"}},
        {due: {name:"Знайома"}},
        {edited: {name:"Змінено"}},
        {created: {name:"Створено"}},
    ];

    const typeChoices = [
        {added: {name:"Додано"}},
        {studied: {name:"Пройдено"}},
        {due: {name:"Знайома"}},
    ];*/

    const choiceItems = Object.entries(todayChoices).map(([key, value]) => ({
        key ,                 
        label: value.name     
    }));

    const flagItems = Object.entries(flagNameColors).map(([key, value]) => ({
        key,                  
        label: value.name  
    }));

    

    const typeItems = Object.entries(typeChoices).map(([key, value]) => ({
        key,               
        label: value.name     
    }));

    const filterConfigs = [
        {
            key: "today",
            title: "Сьогодні",
            icon: clock_icon,
            prefixKey: "today",
            items: choiceItems,
            getItemLabel: (item) => item.label,
            getItemValue: (item) => item.key,
            

            
        },
        {
            key: "flags",
            title: "Флаги",
            icon: flag_icon,
            prefixKey: "flag",
            items:  flagItems , // filters.flags,
            getItemLabel: (item) => item.label,
            getItemValue: (item) => item.key,
        },
        {
            key: "decks",
            title: "Колоди",
            icon: decks_icon,
            prefixKey: "deck",
            items: filters.decks,
            getItemKey: (deck) => deck.id,
            getItemLabel: (deck) => deck.name,
            getItemValue: (deck) => deck.name,
        },
        {
            key: "types",
            title: "Типи",
            icon: type_icon,
            prefixKey: "type",
            items: typeItems,

            getItemLabel: (item) => item.label,
            getItemValue: (item) => item.key,
        },
        {
            key: "tags",
            title: "Теги",
            icon: tag_icon,
            prefixKey: "tag",
            items: filters.tags,
        },
    ];





    return (
        <div 
        className="browseContainer oneOfMainBlock"
        style={{}}
        
        >
            <div className="filtersPanel">

                {filterConfigs.map(({ key, title, icon, prefixKey, items, getItemKey, getItemValue, getItemLabel }) => (
                    <FilterBlock
                        key={key}
                        icon={icon}
                        triangleIcon={trianle_icon}
                        title={title}
                        prefixKey={prefixKey}
                        items={items}
                        expanded={filterExpanded[key]}
                        setExpanded={(val) =>
                            setFilterExpanded((prev) => ({ ...prev, [key]: val }))
                        }
                        getItemKey={getItemKey}
                        getItemValue={getItemValue}
                        getItemLabel={getItemLabel}
                        onFilterClick={(value) => setSearchQuery(value)}
                    />
                ))}














            </div>
            
            <div className="searchAndTablePanel">
                <div className="searchBox">
                    <input
                        type="text"
                        className="searchInput"
                        placeholder='Seach cards type text and click away, for a advance seach use "deck:{deckName}".}'
                        style={{padding: 5 + "px"}}
                        
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                                {/*<th>Флажок</th>*/}
                                <th>Інтервал</th>
                                <th>Складність</th>
                                <th>Оновлено</th>
                                <th>Невдач</th>
                                <th>Переглядів</th>
                                <th>Теги</th>
                                <th>Створено</th>
                                <th>Повторено</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getFilteredCards().map((card, index) => (
                            <tr key={card.id} 
                                className={`${card.deleted === true ? "deleted" : ""}`}
                                style={{
                                backgroundColor: card.flag && flagColors[card.flag] ? flagColors[card.flag] : index % 2 === 0 ? "var(--bg-color)" : "var(--header-color)" 
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
                                {/*<td className="tableTextCenter">{card.flag || "—"}</td>*/}
                                <td className="tableTextCenter">{card.daysJump}</td>
                                <td className="tableTextCenter">{card.ease}</td>
                                <td className="tableTextCenter">{card.updatedAt /*()=> {
                                    const date = new Date(card.updatedAt).toLocaleDateString();
                                    date?. === null? null : "—"} */}</td> 
                                <td className="tableTextCenter">{card.lapses}</td>
                                <td className="tableTextCenter">{card.reviews}</td>
                                <td 
                                    className="tableText"
                                    style={{maxWidth: 100 +"px"}}
                                >
                                    {card.tag}
                                </td>
                                <td className="tableTextCenter">{new Date(card.createdAt).toLocaleDateString() || "—"}</td>
                                <td className="tableTextCenter">{card.studiedAt}</td> 
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