export const CARD_WIDTH = 140;
export const CARD_HEIGHT = 190;


export const SUIT_TYPES = ['spades', 'hearts', 'diamonds', 'clubs'];
export const RANK_TYPES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a'];

export type SUITS =  (typeof SUIT_TYPES)[number];;
export type RANKS =  (typeof RANK_TYPES)[number];;

export interface CardType {
    suit: SUITS;
    rank: RANKS;
};

export const cardValueMap: Record<RANKS, number> = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'j': 10,
    'q': 10,
    'k': 10,
    'a': 11,
  };
  