import { CardType, RANK_TYPES, SUIT_TYPES } from './types';

export const cardImages: Record<string, HTMLImageElement> = {};

// 在应用程序启动时加载所有卡牌图像
export function preloadCardImages(callback: () => void) {
  for (const suit of SUIT_TYPES) {
    for (const rank of RANK_TYPES) {
      const cardImage = new Image();
      cardImage.src = `/images/cards/card${suit}${rank}.png`;
      cardImages[`${suit}${rank}`] = cardImage;
    }
  }

  // 绘制牌堆
  const deckImage = new Image();
  deckImage.src = '/images/cards/cardback_green4.png';
  cardImages['back'] = deckImage;
  deckImage.onload = () => callback();
}


export function initDeck(deckCount: number): CardType[] {
    const deck: CardType[] = [];
  
    for (let i = 0; i < deckCount; i++) {
      for (let suit of SUIT_TYPES) {
        for (let rank of RANK_TYPES) {
          deck.push({ suit, rank });
        }
      }
    }
  
    shuffleDeck(deck);
  
    return deck;
  }
  
  export function shuffleDeck(deck: CardType[]) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
