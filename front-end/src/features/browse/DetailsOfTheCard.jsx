import { useRef, useState, useEffect } from "react";
import "./DetailsOfTheCard.css";


function DetailsOfTheCard({ front, setFront, back, setBack }) { // { card, setcard}


  /*const setFront = (value) => {
    setcard({ ...card, front: value });
  };
  const setBack = (value) => {
    setcard({ ...card, back: value });
  };*/

  const frontRef = useRef(null);

  useEffect(() => {
    if (frontRef.current && frontRef.current.textContent !== front) {
      frontRef.current.textContent = front;
    }
  }, [front]);

  const backRef = useRef(null);

  useEffect(() => {
    if (backRef.current && backRef.current.textContent !== back) {
      backRef.current.textContent = back;
    }
  }, [back]);


  return (
    <div className="detailOfTheCard oneOfMainBlock">
      <div className="containers">
        <div className="flexCenter">
          <div className="blockName">Передня частина</div>
        </div>
        
        <div className="container">
          <div
            contentEditable
            className="fake_input"
            onInput={(e) => setFront(e.currentTarget.textContent)}
            suppressContentEditableWarning={true}
            ref={frontRef} 
          />
        </div>
            
          


        <div className="flexCenter">
            <div className="blockName">Задня частина</div>
          </div>
        <div className="container">

          <div
            contentEditable
            className="fake_input"
            onInput={(e) => setBack(e.currentTarget.textContent)}
            suppressContentEditableWarning={true}
            ref={backRef}
          />

        </div>
      
        
      </div>
      
    </div>
  );
}

export default DetailsOfTheCard;
