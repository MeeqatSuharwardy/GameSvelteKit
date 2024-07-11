<script>
    import PlayingCard from '$lib/components/PlayingCard.svelte';
    import { createDeck, dealCards, compareHands, evaluateHand } from '$lib/utils.js';
    import { onMount } from 'svelte';

    export let players = [
        { id: 1, name: "Player 1", chips: 1000, hand: [], folded: false, bet: 0 },
        { id: 2, name: "Player 2", chips: 1000, hand: [], folded: false, bet: 0 },
        { id: 3, name: "Player 3", chips: 1000, hand: [], folded: false, bet: 0 },
        { id: 4, name: "Player 4", chips: 1000, hand: [], folded: false, bet: 0 }
    ];

    let pot = 0;
    let communityCards = [];
    let currentDeck = createDeck();
    let currentPlayerIndex = 0;
    let currentBet = 0;
    let round = 0;
    let smallBlind = 10;
    let bigBlind = 20;
    let dealerIndex = 0;
    let gameEnded = false;
    let winner = null;
    let winningHand = null;

    function startGame() {
        currentDeck = createDeck();
        const hands = dealCards(currentDeck, players.length);
        players = players.map((player, index) => ({
            ...player,
            hand: hands[index],
            folded: false,
            bet: 0
        }));
        communityCards = [];
        pot = 0;
        currentPlayerIndex = (dealerIndex + 1) % players.length;
        currentBet = bigBlind;
        round = 0;
        gameEnded = false;
        winner = null;
        winningHand = null;

        // Set blinds
        players[(dealerIndex + 1) % players.length].chips -= smallBlind;
        players[(dealerIndex + 1) % players.length].bet = smallBlind;
        players[(dealerIndex + 2) % players.length].chips -= bigBlind;
        players[(dealerIndex + 2) % players.length].bet = bigBlind;
        pot = smallBlind + bigBlind;
    }

    function dealFlop() {
        communityCards = currentDeck.splice(-3);
        round++;
        if (round === 1) {
            setTimeout(nextRound, 2000); // Add delay for the next round
        }
    }

    function dealTurn() {
        communityCards = [...communityCards, currentDeck.pop()];
        round++;
        if (round === 2) {
            setTimeout(nextRound, 2000); // Add delay for the next round
        }
    }

    function dealRiver() {
        communityCards = [...communityCards, currentDeck.pop()];
        round++;
        if (round === 3) {
            setTimeout(determineWinner, 2000); // Add delay for the winner determination
        }
    }

    function nextRound() {
        switch (round) {
            case 0:
                dealFlop();
                break;
            case 1:
                dealTurn();
                break;
            case 2:
                dealRiver();
                break;
        }
    }

    function playerAction(playerId, action, raiseAmount = 10) {
        const playerIndex = players.findIndex(player => player.id === playerId);

        if (players[playerIndex].folded) {
            return;
        }

        switch (action) {
            case 'fold':
                players[playerIndex].folded = true;
                break;
            case 'call':
                const callAmount = currentBet - players[playerIndex].bet;
                if (players[playerIndex].chips >= callAmount) {
                    players[playerIndex].chips -= callAmount;
                    players[playerIndex].bet += callAmount;
                    pot += callAmount;
                }
                break;
            case 'raise':
                const raiseDiff = raiseAmount - players[playerIndex].bet;
                if (players[playerIndex].chips >= raiseDiff) {
                    players[playerIndex].chips -= raiseDiff;
                    players[playerIndex].bet += raiseDiff;
                    pot += raiseDiff;
                    currentBet = raiseAmount;
                }
                break;
        }

        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

        // Check if all players have acted for this round
        if (currentPlayerIndex === dealerIndex) {
            nextRound();
        }
    }

    function determineWinner() {
        let bestPlayer = null;
        let bestHand = null;

        players.forEach(player => {
            if (!player.folded) {
                const playerHand = evaluateHand(player.hand, communityCards);
                if (!bestPlayer || compareHands(bestHand, playerHand, communityCards) < 0) {
                    bestPlayer = player;
                    bestHand = playerHand;
                }
            }
        });

        if (bestPlayer) {
            bestPlayer.chips += pot;
            winner = bestPlayer;
            winningHand = bestHand.descr;
        }

        // Check if game should end
        checkForGameEnd();

        if (!gameEnded) {
            // Move dealer button and start new game
            dealerIndex = (dealerIndex + 1) % players.length;
            startGame();
        }
    }

    function checkForGameEnd() {
        const activePlayers = players.filter(player => player.chips > 0);
        if (activePlayers.length === 1) {
            gameEnded = true;
            winner = activePlayers[0];
            winningHand = evaluateHand(winner.hand, communityCards).descr;
        } else if (round === 3) {
            gameEnded = true;
        }
    }

    function endGame() {
        gameEnded = true;
        winner = players.reduce((prev, curr) => (curr.chips > prev.chips ? curr : prev));
        winningHand = evaluateHand(winner.hand, communityCards).descr;
    }

    onMount(startGame);
</script>

<div class="poker-table">
    {#if gameEnded}
        <div class="game-over">
            <h2>Game Over</h2>
            <p>Winner: {winner.name}</p>
            <p>Winning Hand: {winningHand}</p>
            <button on:click={startGame}>Restart Game</button>
        </div>
    {:else}
        <div class="community-cards">
            {#each communityCards as card}
                <PlayingCard value={card} class="fade-in" />
            {/each}
        </div>
        <div class="pot">
            Pot: ${pot}
        </div>
        <div class="players">
            {#each players as player}
                <div class="player">
                    <div class="player-info">
                        <span>{player.name}</span>
                        <span>Chips: {player.chips}</span>
                    </div>
                    <div class="player-hand">
                        {#each player.hand as card}
                            <PlayingCard value={card} class="player-card" />
                        {/each}
                    </div>
                    <div class="player-actions">
                        <button on:click={() => playerAction(player.id, 'fold')}>Fold</button>
                        <button on:click={() => playerAction(player.id, 'call')}>Call</button>
                        <button on:click={() => playerAction(player.id, 'raise', currentBet + 10)}>Raise</button>
                    </div>
                </div>
            {/each}
        </div>
        <div class="game-actions">
            <button on:click={startGame}>Start Game</button>
            <button on:click={endGame}>End Game</button>
        </div>
    {/if}
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

    body {
        font-family: 'Roboto', sans-serif;
        background-color: #282c34;
        color: white;
    }

    .poker-table {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #2d6a4f;
        border-radius: 10px;
        padding: 20px;
        margin: 20px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    }

    .community-cards {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    .community-cards .card {
        margin-right: 10px;
        animation: fadeIn 1s ease-in-out;
    }

    .pot {
        font-size: 24px;
        margin-bottom: 20px;
        background-color: #1b4332;
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }

    .players {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 20px;
    }

    .player {
        background-color: #081c15;
        padding: 20px;
        border-radius: 10px;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }

    .player-info {
        margin-bottom: 10px;
    }

    .player-hand {
        display: flex;
        margin-bottom: 10px;
    }

    .player-hand .player-card {
        animation: deal 0.5s ease-in-out;
    }

    .player-actions {
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .player-actions button {
        padding: 5px 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background-color: #ff007f;
        color: white;
        transition: background-color 0.3s;
    }

    .player-actions button:hover {
        background-color: #d0006f;
    }

    .game-actions {
        margin-top: 20px;
        display: flex;
        gap: 10px;
    }

    .game-actions button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background-color: #ff007f;
        color: white;
        transition: background-color 0.3s;
    }

    .game-actions button:hover {
        background-color: #d0006f;
    }

    .game-over {
        text-align: center;
    }

    .game-over h2 {
        margin: 0;
        font-size: 2rem;
    }

    @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
    }

    @keyframes deal {
        0% { transform: translateY(-50px) rotateY(90deg); opacity: 0; }
        100% { transform: translateY(0) rotateY(0deg); opacity: 1; }
    }
</style>
