import React from 'react';
import utilStyles from '../styles/utils.module.css';
import { useState } from 'react';
import Card from '../objects/wordCardObject'

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
      :  <h1>{props.kanji}</h1>}
    </div>
  );
}


export default WordCard;