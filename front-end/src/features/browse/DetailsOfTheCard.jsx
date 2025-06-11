import { useRef, useState, useEffect } from "react";
import "./DetailsOfTheCard.css";

import change_icon from "../../assets/change-icon.png"
import trash_icon from "../../assets/trash-icon.png"
import untrash_icon from "../../assets/untrash-icon.png"


function DetailsOfTheCard({cards, setCards, decks, flagNameColors, selectedDeckIdForDetails }) { // { card, setcard}

  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [selectedDeck, setSelectedDeck] = useState("");
  const [selectedFlag, setSelectedFlag] = useState("");

  const [deleted, setDeleted] = useState(false);

  const [originalCard, setOriginalCard] = useState(null);
  

  const flagItems = Object.entries(flagNameColors).map(([key, value]) => ({
        key,                  
        label: value.name  
    }));

  useEffect(() => {
    const card = cards.find(c => c.id === selectedDeckIdForDetails);
    if (card) {
      setFront(card.front || "");
      setBack(card.back || "");
      setSelectedDeck(card.deckId || "");
      setSelectedFlag(card.flag || "-");
      setDeleted(false);

      frontRef.current.textContent = card.front;
      backRef.current.textContent = card.back;

      setOriginalCard(card);
    } else {
      setFront("");
      setBack("");
      setSelectedDeck("-");
      setSelectedFlag("-");
      setDeleted(false);
    }
  }, [selectedDeckIdForDetails]);


  const frontRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    if (frontRef.current && frontRef.current.textContent !== front) {
      frontRef.current.textContent = front;
    }

    if (backRef.current && backRef.current.textContent !== back) {
      backRef.current.textContent = back;
    }
  }, [front, back]);


  const isModified = 
  originalCard && (
    front !== originalCard.front ||
    back !== originalCard.back ||
    selectedDeck !== originalCard.deckId ||
    selectedFlag !== originalCard.flag ||
    deleted !== originalCard.deleted
  );
  
  const handleSave = () => {
    if (!originalCard) return;

    const now = Date.now();
    const modifiedAt = new Date(now).toISOString();

    const updatedCards = cards.map(card =>
      card.id === selectedDeckIdForDetails
        ? {
            ...card,
            front,
            back,
            deckId: selectedDeck,
            flag: selectedFlag,
            modified_at: modifiedAt,
            unsynchronised: true,
            ...(deleted === true ? { deleted: true } : {})
          }
        : card
    );

    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
  };

  const handleDelete = () => {
    !deleted ? setDeleted(true): setDeleted(false)
  };


  return (
    <div className="detailOfTheCard oneOfMainBlock">
      <fieldset className="noPadding"  disabled={!selectedDeckIdForDetails}>
        <div className="containers">
          <div className="flexCenterWithoutJC spaceBetween width80percent" >
          
            <div className="flexEnd" >
              <div className="blockName" style={{width: "auto"}}>Лицьова</div>
            </div>

              <select 
                className="customSelect "
                style={{width: 25 + "%"}}
                value={selectedDeck}
                onChange={(e) => setSelectedDeck(e.target.value)}>
                  <option value="null">-</option>  
                  {decks.map((deck) => (
                      <option key={deck.id} value={deck.id}>
                      {deck.name}
                      </option>
                  ))}
              </select>

              <select 
                className="customSelect width30percent"
                
                style={{width: 25 + "%"}}
                value={selectedFlag}
                onChange={(e) => setSelectedFlag(e.target.value)}>
                  <option value="null">-</option>  
                  {flagItems.map(flag => (
                    <option key={flag.key} value={flag.key}>
                      {flag.label}
                    </option>
                  ))}
              </select>

              <div className="divForIcon">
                
                <img 
                  src={change_icon}
                  className="image_button"
                  alt="Редагувати" 
                  onClick={handleSave}
                  disabled={!isModified}
                  role="button"
                />

              </div>
          
          </div>

          <div className="topBox">
              <div className="nameAndContainer">

                <div className="container" style={{width: 100 + "%"}}>

                  <div
                    contentEditable={!!selectedDeckIdForDetails}
                    className="fake_input"
                    style={{width: 90 + "%"}}
                    onInput={(e) => setFront(e.currentTarget.textContent)}
                    suppressContentEditableWarning={true}
                    ref={frontRef}
                  />

                </div>
                

              </div>

              <div className="divForIcon">
                
                <img 
                  src={trash_icon}
                  className="image_button hidden"
                  alt="Редагувати" 
                  onClick={handleSave}
                  disabled={!isModified}
                  role="button"
                />

              </div>

              
            </div>



            <div className="bottomBox">
              <div className="nameAndContainer">

                <div className="flexCenter" style={{width: 100 + "%"}}>
                  <div className="blockName" >Зворіт</div>
                </div>

                <div className="container" style={{width: 100 + "%"}}>

                  <div
                    contentEditable={!!selectedDeckIdForDetails}
                    className="fake_input"
                    style={{width: 90 + "%"}}
                    onInput={(e) => setBack(e.currentTarget.textContent)}
                    suppressContentEditableWarning={true}
                    ref={backRef}
                  />

                </div>
                

              </div>

              <div className="divForIcon" style={{ flexDirection: "column",justifyContent: "flex-end"}}>
                
                <img 
                  src={ deleted ? untrash_icon: trash_icon}
                  className="image_button"
                  alt="Редагувати" 
                  onClick={handleDelete}
                  disabled={!isModified}
                  role="button"
                />

              </div>

              
            </div>
          
          
          
          <div className="containerAndDelButton"> 
            

            
          </div>

        
          
        </div>
      </fieldset>
      
    </div>
  );
}

export default DetailsOfTheCard;
