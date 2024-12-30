import React from 'react';
import utilStyles from '../styles/utils.module.css';
import { useState } from 'react';
import Card from '../objects/wordCardObject.tsx'

const WordCard = (props : Card ) => {
  const [hovered, setHovered] = useState(false);

  return (
    props.learned ? <></> :
    <div 
      className={utilStyles.containerSmall}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered ? 
      <>
        <p>{props.pronounce}</p><p>{props.translation}</p> 
      </>
      :  <p>{props.kanji}</p>}
    </div>
  );
}


export default WordCard;