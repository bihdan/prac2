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
        <span>front</span>
        <div className="frontContainer">
          <div
            contentEditable
            className="fake_input"
            onInput={(e) => setFront(e.currentTarget.textContent)}
            suppressContentEditableWarning={true}
            ref={frontRef} 
          />
            
          
      </div>

      <span>back</span>
      <div className="backContainer">

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
