// src/lib/handEvaluator.js

export function evaluateHand(hand, communityCards) {
  // Simple evaluation: just return the highest card for now
  const allCards = [...hand, ...communityCards];
  const ranks = allCards.map((card) => card.slice(0, -1));
  ranks.sort((a, b) => RANKS.indexOf(b) - RANKS.indexOf(a));
  return ranks[0];
}

export function compareHands(hand1, hand2, communityCards) {
  const bestHand1 = evaluateHand(hand1, communityCards);
  const bestHand2 = evaluateHand(hand2, communityCards);

  if (RANKS.indexOf(bestHand1) > RANKS.indexOf(bestHand2)) {
    return 1;
  } else if (RANKS.indexOf(bestHand1) < RANKS.indexOf(bestHand2)) {
    return -1;
  } else {
    return 0;
  }
}
