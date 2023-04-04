import React, { useState,useEffect } from 'react';
import TableCanvas from '../components/TableCanvas';
import { CardType,  cardValueMap} from '../types';
import { preloadCardImages, initDeck, shuffleDeck } from '../gameUtils';

interface BlackjackState {
    deck: CardType[];
    playerCards: CardType[];
    dealerCards: CardType[];
    playerScore: number;
    dealerScore: number;
    isDealerTurn: boolean;
    isGameOver: boolean;
  }

  
const Blackjack = () => {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerCards, setPlayerCards] = useState<CardType[]>([]);
  const [dealerCards, setDealerCards] = useState<CardType[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [isDealerTurn, setIsDealerTurn] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [splitCards, setSplitCards] = useState<CardType[][] | null>(null);

  let isInited = false;

  useEffect(() => {
    if (!isInited) {
        initGame();
        console.log("initGame!!!!!");
        isInited = true;
    }
  }, []);
  
  const handleDouble = () => {
    const newCard = drawCardFromDeck(deck);
    setPlayerCards([...playerCards, newCard]);
    const newScore = calculateScore([...playerCards, newCard]);
    setPlayerScore(newScore);
    setIsDealerTurn(true);
  };
  
  const handleSplit = () => {
    // const newDeck = [...deck];
    // const newPlayerCards: CardType[][] = [[], []];
    // newPlayerCards[0].push(playerCards[0]);
    // newPlayerCards[1].push(playerCards[1]);
    // const newCard1 = drawCardFromDeck(newDeck);
    // newPlayerCards[0].push(newCard1);
    // const newCard2 = drawCardFromDeck(newDeck);
    // newPlayerCards[1].push(newCard2);
    // setDeck(newDeck);
    // setPlayerCards(newPlayerCards[0]);
    // setPlayerScore(calculateScore(newPlayerCards[0]));
    // setIsDealerTurn(false);
    // setSplitCards(newPlayerCards);
  };
  
  const handleSurrender = () => {
    // setIsGameOver(true);
    // setDealerCards([...dealerCards, drawCardFromDeck(deck)]);
  };
  
  useEffect(() => {
    let dealerScoreTemp = 0;
    let dealerCardsTemp: CardType[] = [];
    if (isDealerTurn && playerScore <= 21) {
      while (dealerScoreTemp < 17) {
        const newCard = drawCardFromDeck(deck);
        const newScore = calculateScore([...dealerCardsTemp, newCard]);
        dealerScoreTemp = newScore;
        dealerCardsTemp = [...dealerCardsTemp, newCard];
      }
      setDealerCards(dealerCardsTemp);
      setDealerScore(dealerScoreTemp);
      
      setIsDealerTurn(false);
      setIsGameOver(true);
    }
  }, [isDealerTurn]);
  
  // 游戏状态变更时更新页面
  useEffect(() => {
    if (isGameOver) {
      setIsDealerTurn(false);
    }
  }, [isGameOver]);
  
  // 检查是否分牌
  useEffect(() => {
    if (splitCards) {
      setIsDealerTurn(true);
    }
  }, [splitCards]);
  

  // 初始化牌堆和玩家和庄家的牌
  const initGame = () => {
    preloadCardImages(() => {
        resetGame();
    });
  };

  // 点击 hit 按钮的处理逻辑
  const handleHit = () => {
    const newCard = drawCardFromDeck(deck);
    setPlayerCards([...playerCards, newCard]);
    const newScore = calculateScore([...playerCards, newCard]);
    setPlayerScore(newScore);
    if (newScore > 21) {
      setIsGameOver(true);
    }
  };

  // 点击 stand 按钮的处理逻辑
  const handleStand = () => {
    console.log("handleStand");
    setIsDealerTurn(true);
  };


  const resetGame = () => {
    const newDeck = initDeck(1);
    shuffleDeck(newDeck);
    setDeck(newDeck);

    setPlayerCards([]);
    setDealerCards([]);
    setPlayerScore(0);
    setDealerScore(0);
    setIsDealerTurn(false);
    setIsGameOver(false);
  }

  // 点击 restart 按钮的处理逻辑
  const handleRestart = () => {

    resetGame();
  };

  // 从牌堆中抽取一张牌
  const drawCardFromDeck = (deck: CardType[]): CardType => {
    const newCard = deck.pop();

    if (!newCard) return { suit: '', rank: '' };
    return newCard;
  };
    
  // 计算牌的分数
  const calculateScore = (cards: CardType[]): number => {
    let score = 0;
    let aceCount = 0;
    cards.forEach((card) => {
      if (card.rank === 'a') {
        aceCount++;
      }
      score += cardValueMap[card.rank.toLowerCase()];
    });

    while (score > 21 && aceCount > 0) {
      score -= 10;
      aceCount--;
    }
    return score;
  };


  

  
  return (
    <div>
      <TableCanvas
        deckCount={deck.length}
        playerCards={playerCards}
        dealerCards={dealerCards}
        playerScore={playerScore}
        dealerScore={dealerScore}
        isDealerTurn={isDealerTurn}
        isGameOver={isGameOver}
      />
      <div id='control_panel'>
        <button onClick={handleHit} disabled={isGameOver}>
          Hit
        </button>
        <button onClick={handleStand} disabled={isGameOver}>
          Stand
        </button>
        <button onClick={handleRestart}>Restart</button>
      </div>
    </div>
  );
};

export default Blackjack;
