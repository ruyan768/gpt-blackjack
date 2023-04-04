import React, { useEffect, useRef, useState } from 'react';
import { CARD_WIDTH, CARD_HEIGHT } from '../types';
import { cardImages} from '../gameUtils'
import { CardType } from '../types';

const CARD_SCALE = 1;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const TABLE_WIDTH = 500;
const TABLE_HEIGHT = 350;
const TABLE_X = (CANVAS_WIDTH - TABLE_WIDTH) / 2;
const TABLE_Y = (CANVAS_HEIGHT - TABLE_HEIGHT) / 2;
const PLAYER_CARD_X = 150;
const PLAYER_CARD_Y = TABLE_Y + TABLE_HEIGHT - CARD_HEIGHT * CARD_SCALE - 20;

const DEALER_CARD_Y = TABLE_Y + 20;
const DEALER_CARD_X = 550;

function drawTable(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const tableWidth = 700;
  const tableHeight = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const tableRadiusX = tableWidth / 2;
  const tableRadiusY = tableHeight / 2;
  const tableColor = "#006600";
  const tableBorderColor = "#FFFFFF";
  const borderWidth = 5;

  // 绘制椭圆形桌子
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, tableRadiusX, tableRadiusY, 0, 0, 2 * Math.PI);
  ctx.fillStyle = tableColor;
  ctx.fill();
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = tableBorderColor;
  ctx.stroke();

  // 绘制牌堆位置
  const deckX = centerX - CARD_WIDTH / 2;
  const deckY = centerY - CARD_HEIGHT / 2;
  const deckWidth = CARD_WIDTH;
  const deckHeight = CARD_HEIGHT;
  const deckBorderColor = "#FFFFFF";
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = deckBorderColor;
  ctx.strokeRect(deckX, deckY, deckWidth, deckHeight);

  // 绘制玩家筹码位置
  const playerChipX = centerX - CARD_WIDTH - 20;
  const playerChipY = centerY + CARD_HEIGHT;
  const playerChipWidth = CARD_WIDTH;
  const playerChipHeight = CARD_HEIGHT;
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = tableBorderColor;
  ctx.strokeRect(playerChipX, playerChipY, playerChipWidth, playerChipHeight);

  // 绘制庄家筹码位置
  const dealerChipX = centerX + 20;
  const dealerChipY = centerY - 2 * CARD_HEIGHT;
  const dealerChipWidth = CARD_WIDTH;
  const dealerChipHeight = CARD_HEIGHT;
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = tableBorderColor;
  ctx.strokeRect(dealerChipX, dealerChipY, dealerChipWidth, dealerChipHeight);

  // 绘制玩家牌的位置
  const playerCardX = playerChipX;
  const playerCardY = playerChipY - CARD_HEIGHT - 20;
  const playerCardWidth = CARD_WIDTH * CARD_SCALE;
  const playerCardHeight = CARD_HEIGHT * CARD_SCALE;
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = tableBorderColor;
  ctx.strokeRect(playerCardX, playerCardY, playerCardWidth, playerCardHeight);

  // 绘制庄家牌的位置
  const dealerCardX = dealerChipX;
  const dealerCardY = dealerChipY + dealerChipHeight + 20;
  const dealerCardWidth = CARD_WIDTH * CARD_SCALE;
  const dealerCardHeight = CARD_HEIGHT * CARD_SCALE;
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = tableBorderColor;
  ctx.strokeRect(dealerCardX, dealerCardY, dealerCardWidth, dealerCardHeight);
}
  
function drawDeck(ctx: CanvasRenderingContext2D, deckImage: HTMLImageElement, deckSize: number) {
  const deckX = TABLE_X + TABLE_WIDTH / 2 - CARD_WIDTH / 2;
  const deckY = TABLE_Y + TABLE_HEIGHT / 2 - CARD_HEIGHT / 2;
  for (let i = 0; i < deckSize; i++) {
    ctx.drawImage(deckImage, deckX - i * 0.5, deckY + i * 0.5, CARD_WIDTH, CARD_HEIGHT);
  }
}

function drawChips(
  ctx: CanvasRenderingContext2D,
  chipImage: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  chipCount: number,
) {
  const chipsPerRow = 4;
  const chipSpacing = 10;
  const chipWidth = (width - chipSpacing * (chipsPerRow - 1)) / chipsPerRow;
  const chipHeight = height / Math.ceil(chipCount / chipsPerRow);

  for (let i = 0; i < chipCount; i++) {
    const row = Math.floor(i / chipsPerRow);
    const col = i % chipsPerRow;
    const chipX = x + col * (chipWidth + chipSpacing);
    const chipY = y + row * chipHeight;

    ctx.drawImage(chipImage, chipX, chipY, chipWidth, chipHeight);
  }
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  card: CardType,
  x: number,
  y: number,
  angle: number,
  isDealer: boolean
) {
  const { rank, suit } = card;
  const cardName = `${suit}${rank}`;
  const img = cardImages[cardName];
  const cardWidth = CARD_WIDTH * CARD_SCALE;
  const cardHeight = CARD_HEIGHT * CARD_SCALE;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.drawImage(img, -cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
  ctx.restore();
};

function drawCards(
  ctx: CanvasRenderingContext2D,
  cards: CardType[],
  x: number,
  y: number,
  angle: number,
  isDealer: boolean
) {
  // 计算卡牌实际尺寸
  const cardWidth = CARD_WIDTH * CARD_SCALE;
  const cardHeight = CARD_HEIGHT * CARD_SCALE;

  // 计算卡牌间隔
  const cardOffset = cardWidth * 0.5;

  // 计算卡牌组中心位置
  const centerX = x + (cards.length - 1) * cardOffset;
  const centerY = y + cardHeight * 0.5;

  // 保存画布状态
  ctx.save();

  // 设置卡牌组的旋转中心和旋转角度
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);

  // 绘制每张卡牌
  cards.forEach((card, index) => {
    // 计算卡牌的实际位置
    const cardX = -index * cardOffset - cardWidth * 0.5;
    const cardY = -cardHeight * 0.5;

    // 绘制卡牌
    drawCard(ctx, card, cardX, cardY, angle, isDealer);
  });

  // 恢复画布状态
  ctx.restore();
}

interface Props {
  deckCount: number;
  playerCards: CardType[];
  dealerCards: CardType[];
  playerScore: number;
  dealerScore: number;
  isDealerTurn: boolean;
  isGameOver: boolean;
}

const TableCanvas = ({
  deckCount,
  playerCards,
  dealerCards,
  playerScore,
  dealerScore,
  isDealerTurn,
  isGameOver,
}: Props) => {
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const showDealerScore = isDealerTurn || isGameOver;

  useEffect(() => {


    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);


    // 绘制牌桌
    drawTable(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

    const deckImage = cardImages['back'];
    drawDeck(ctx, deckImage, deckCount);

    // 绘制玩家和庄家的牌
    drawCards(ctx, playerCards, PLAYER_CARD_X, PLAYER_CARD_Y, 0, false);
    drawCards(ctx, dealerCards, DEALER_CARD_X, DEALER_CARD_Y, 0, true);

    // 绘制玩家和庄家的筹码
    const playerChipImg = new Image();
    playerChipImg.src = '/images/chips/chipredwhite_border.png';
    playerChipImg.onload = () => {
      drawChips(ctx, playerChipImg, 180, 540, 100, 50, 10);
    };

    const dealerChipImg = new Image();
    dealerChipImg.src = '/images/chips/chipbluewhite_border.png';
    dealerChipImg.onload = () => {
      drawChips(ctx, dealerChipImg, 695, 10, 100, 50, 10);
    };

    if (isGameOver)
    {
      ctx.save();
      ctx.font = 'bold 100px Arial';

      const result = getGameResult();
      ctx.fillStyle =result === 'You Win' ? 'green' : 'red';
      //ctx.fillStyle = playerScore > dealerScore ? 'green' : 'red';
      ctx.fillText(getGameResult(), CANVAS_WIDTH/2 - 200, CANVAS_HEIGHT/2);
      ctx.restore();
    }

  }, [isGameOver, playerScore, dealerScore, playerCards, dealerCards, deckCount]);

  // useEffect(() => {
  //   if (isGameOver && canvasRef.current) {
  //     const ctx = canvasRef.current.getContext('2d');
  //     if (ctx) {
  //       ctx.save();
  //       ctx.font = 'bold 60px Arial';
  //       ctx.fillStyle = playerScore > dealerScore ? 'green' : 'red';
  //       ctx.fillText(getGameResult(), CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
        
  //       ctx.restore();
  //     }
  //   }
  // }, [isGameOver, playerScore, dealerScore]);

  const getGameResult = (): string => {
    if (isGameOver) {
      if (playerScore > 21) {
        return 'You Lose';
      } else if (dealerScore > 21) {
        return 'You Win';
      } else if (playerScore > dealerScore) {
        return 'You Win';
      } else if (playerScore === dealerScore) {
        return 'Tie';
      } else {
        return 'You Lose';
      }
    } else {
      return '';
    }
  };

  return (

    <div>
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ border: '1px solid black' }}
    />
    <div>
      <div style={ { marginTop: -80,marginLeft: 5 }}>
        <span>Deck: {deckCount}</span>
        <br />
        <span>Player score: {playerScore}</span>
        <br />
        { <span>Dealer score: {dealerScore}</span>}
        <br />
      </div>
    </div>
    </div>

  );
};

export default TableCanvas;
