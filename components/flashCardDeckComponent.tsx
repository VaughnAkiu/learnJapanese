import utilStyles from '../styles/utils.module.css';
import React, {useEffect, useState} from 'react';
import Card from '../objects/wordCardObject'

const FlashCardDeck = ({cards} : {cards : Card[]}) => {
  const [hovered, setHovered] = useState(false);

  const [currentCard, setCurrentCard] = useState<Card>();
  const [deckCopy, setDeckCopy] = useState<Card[]>();
  const [cardCounter, setCardCounter] = useState(1);

  const [loading, setLoading] = useState(true);

    useEffect(() => {
      // console.log("test props", props);
      setDeckCopy(cards);
      // console.log("test deckCopy", deckCopy);
      // console.log(props.length);
      // console.log(cards.length);
      setCurrentCard(cards[0]);
      console.log("test props is an array", Array.isArray(cards));
      setLoading(false);
    }, []);

  const clickFlashCard = () => {
    // create a copy of deck
    // pop off top card of deck and show it
      // setCurrentCard(deckCopy.pop());
    // shouldnt? use pop when modifying state
    console.log(deckCopy.length);
    if(cardCounter < cards.length - 1) {
      setCardCounter(cardCounter + 1);
      setCurrentCard(cards[cardCounter])
    }
    else {
      setCardCounter(0);
      setCurrentCard(cards[cardCounter])
    }
    
    // if no cards to pop off then create another copy
    console.log("clicked");
  }

  return (
    <div 
      className={utilStyles.containerSmall}
      onClick={() => clickFlashCard()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {loading ? <p>loading...</p> :       
      hovered ? 
      <>
        <p>{currentCard.pronounciation}</p><p>{currentCard.translation}</p> 
      </>
      :  <h1>{currentCard.kanji}</h1>}
    </div>
  );
}


export default FlashCardDeck;