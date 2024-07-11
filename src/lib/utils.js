// src/lib/utils.js
import pokersolver from "pokersolver";
const { Hand } = pokersolver;

export const SUITS = ["S", "H", "D", "C"];
export const RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

export function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(`${rank}${suit}`);
    }
  }
  return shuffle(deck);
}

export function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function dealCards(deck, numPlayers) {
  const hands = Array.from({ length: numPlayers }, () => []);
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < numPlayers; j++) {
      hands[j].push(deck.pop());
    }
  }
  return hands;
}

export function evaluateHand(hand, communityCards) {
  const fullHand = [...hand, ...communityCards].map((card) => {
    const rank = card.slice(0, -1);
    const suit = card.slice(-1);
    return `${rank}${suit.toLowerCase()}`;
  });

  return Hand.solve(fullHand);
}

export function compareHands(hand1, hand2, communityCards) {
  const bestHand1 = evaluateHand(hand1, communityCards);
  const bestHand2 = evaluateHand(hand2, communityCards);

  return Hand.winners([bestHand1, bestHand2])[0] === bestHand1 ? 1 : -1;
}
