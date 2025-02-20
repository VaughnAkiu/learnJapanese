import utilStyles from '../styles/utils.module.css';
import React, {useEffect, useState} from 'react';
import Card from '../objects/wordCardObject'
// import { useSession } from 'next-auth/react';

const FlashCardDeck = ({cards} : {cards : Card[]}) => {
  // const [hovered, setHovered] = useState(false);
  // const { data: session, status } = useSession();
  const [flipped, setFlipped] = useState(false);

  const [currentCard, setCurrentCard] = useState<Card>();
  // const [deckCopy, setDeckCopy] = useState<Card[]>();
  const [cardCounter, setCardCounter] = useState(1);

  const [loading, setLoading] = useState(true);

    useEffect(() => {

      setCurrentCard(cards[0]);
      setLoading(false);
    }, []);

  const clickFlashCard = () => {
    setFlipped(!flipped);
  }

  const clickNextButton = () => {
    if(cards.length < 2) {
      return;
    }
    // create a copy of deck
    // pop off top card of deck and show it
      // setCurrentCard(deckCopy.pop());
    // shouldnt? use pop when modifying state
    if(cardCounter < cards.length - 1) {
      setCardCounter(cardCounter + 1);
      setCurrentCard(cards[cardCounter])
    }
    else {
      setCardCounter(0);
      setCurrentCard(cards[cardCounter])
    }
    
    // if no cards to pop off then create another copy
  }

  return (
    <>
        <div 
      className={utilStyles.containerFlashCard}
      onClick={() => clickFlashCard()}
      // onMouseEnter={() => setHovered(true)}
      // onMouseLeave={() => setHovered(false)}
    >
      {loading ? <p>loading...</p> :       
      flipped ? 
      <>
        <div className={utilStyles.headingLg}>{currentCard.pronounciation}</div>
        <div className={utilStyles.headingMd}>{currentCard.translation}</div> 
        <div className={utilStyles.headingMd}>{currentCard.example}</div>
        <div className={utilStyles.headingMd}>{currentCard.example_translation}</div>  
      </>
      :  <div className={utilStyles.headingFlashCard}>{currentCard.kanji}</div>}
    </div>
    <div className={utilStyles.containerLogin} onClick={() => clickNextButton()}>Next</div>
    </>
  );


}


export default FlashCardDeck;