<script>
import coin from '$lib/images/coin.png';
import dice1 from '$lib/images/dice1.png';
import dice2 from '$lib/images/dice2.png';
import dice3 from '$lib/images/dice3.png';
import dice4 from '$lib/images/dice4.png';
import dice5 from '$lib/images/dice5.png';
import dice6 from '$lib/images/dice6.png';
import WalletConnectLogo from '$lib/images/walletconnect.png';
import CoinbaseWalletLogo from '$lib/images/coinbasewallet.png';
import TrustWalletLogo from '$lib/images/trustwallet.png';
import LedgerLogo from '$lib/images/ledger.png';
import { onMount } from 'svelte';

let wager = 0;
let bets = 1;
let multiplier = 1.4347;
let winChance = 69;
let connected = false;
let game = 'dice'; // Initial game
let showWalletOptions = false;
let coinResult = '';
let isFlipping = false;
let diceResults = [1, 1]; // Results for two dice
let isRolling = false;

const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];

// Reactive declaration to dynamically update rollOver based on winChance
$: rollOver = 100 - winChance;

function rollDice() {
    isRolling = true;
    setTimeout(() => {
        diceResults = [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ];
        isRolling = false;
    }, 1000);
}

function flipCoin() {
    isFlipping = true;
    setTimeout(() => {
        coinResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
        isFlipping = false;
    }, 1000);
}

function connectWallet() {
    showWalletOptions = true;
}

function selectWallet(walletName) {
    console.log(`Connecting to ${walletName}`);
    connected = true;
    showWalletOptions = false;
}

function closeWalletOptions() {
    showWalletOptions = false;
}

onMount(() => {
    const images = [coin, dice1, dice2, dice3, dice4, dice5, dice6, WalletConnectLogo, CoinbaseWalletLogo, TrustWalletLogo, LedgerLogo];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

function selectGame(selectedGame) {
    game = selectedGame;
}
</script>

<svelte:head>
    <title>Casino Games</title>
    <meta name="description" content="A simple casino game app" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="game-container">
    <div class="game-selector">
        <button on:click={() => selectGame('coinflip')} class:active={game === 'coinflip'}>Coin Flip</button>
        <button on:click={() => selectGame('dice')} class:active={game === 'dice'}>Dice</button>
    </div>

    <div class="betting-panel">
        <h2>Wager</h2>
        <input type="number" bind:value={wager} placeholder="Choose a wager..." />
        <button on:click={() => wager = wager / 2}>½</button>
        <button on:click={() => wager = wager * 2}>2x</button>
        <button on:click={() => wager = 100}>Max</button>

        <h2>Bets</h2>
        <input type="number" bind:value={bets} />

        <div class="advanced">
            {#if game === 'dice'}
                <h2>Multiplier</h2>
                <input type="number" bind:value={multiplier} step="0.0001" />

                <h2>Win Chance</h2>
                <input type="number" bind:value={winChance} step="0.1" />
            {/if}
        </div>

        <button class="connect-button" on:click={connectWallet}>
            {connected ? 'Wallet Connected' : 'Connect Wallet'}
        </button>
    </div>

    <div class="game-panel">
        {#if game === 'dice'}
            <div class="result-bar">
                <div class="bar" style="background: linear-gradient(90deg, red {rollOver}%, green {rollOver}%)">
                    <span class="marker" style="left: {rollOver}%;">{rollOver}</span>
                </div>
            </div>
            <div class="controls">
                <button class="roll-button" on:click={rollDice}>Roll Dice</button>
                {#if diceResults[0] && diceResults[1]}
                    <p class="white-text">Dice Results: {diceResults[0]} and {diceResults[1]}</p>
                {/if}
                <p class="white-text">Multiplier: {multiplier}</p>
                <p class="white-text">Win Chance: {winChance}%</p>
            </div>
            <div class={`dice-container ${isRolling ? 'rolling' : ''}`}>
                {#each diceResults as result}
                    <img src={diceImages[result - 1]} alt={`Dice ${result}`} class="dice" />
                {/each}
            </div>
        {:else}
            <div class="coin-flip">
                <div class="coin-result">
                    {#if coinResult && !isFlipping}
                        <img src={coin} alt={coinResult} class="coin" />
                        <p>{coinResult}</p>
                    {:else if isFlipping}
                        <img src={coin} alt="Flipping" class="coin flipping" />
                    {:else}
                        Flip the Coin!
                    {/if}
                </div>
                <div class="coin-controls">
                    <button on:click={flipCoin}>Flip Coin</button>
                </div>
            </div>
        {/if}
    </div>
</div>

{#if showWalletOptions}
    <div class="wallet-modal" style="visibility: {showWalletOptions ? 'visible' : 'hidden'};">
        <div class="wallet-options">
            <button class="close-button" on:click={closeWalletOptions}>✖</button>
            <div class="wallet-option" on:click={() => selectWallet('WalletConnect')}>
                <img src={WalletConnectLogo} alt="WalletConnect" />
                <span>WalletConnect</span>
            </div>
            <div class="wallet-option" on:click={() => selectWallet('Coinbase Wallet')}>
                <img src={CoinbaseWalletLogo} alt="Coinbase Wallet" />
                <span>Coinbase Wallet</span>
            </div>
            <div class="wallet-option" on:click={() => selectWallet('Trust Wallet')}>
                <img src={TrustWalletLogo} alt="Trust Wallet" />
                <span>Trust Wallet</span>
            </div>
            <div class="wallet-option" on:click={() => selectWallet('Ledger')}>
                <img src={LedgerLogo} alt="Ledger" />
                <span>Ledger</span>
            </div>
        </div>
    </div>
{/if}

<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
    body {
        background-color: #111;
        color: white;
        font-family: 'Roboto', sans-serif;
    }
    .game-container {
        display: flex;
        flex-direction: column;
        padding: 20px;
    }
    .game-selector {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }
    .game-selector button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background-color: #333;
        color: white;
        font-weight: bold;
        margin: 0 10px;
    }
    .game-selector button.active {
        background-color: #ff007f;
        color: white;
    }
    .betting-panel {
        width: 30%;
        padding: 20px;
        background-color: #222;
        border-radius: 8px;
        border: 1px solid #333;
        margin: 0 auto 20px;
    }
    .betting-panel h2 {
        margin: 10px 0;
        color: gold;
    }
    .betting-panel input, .betting-panel button {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
        border: 1px solid #444;
        background-color: #333;
        color: white;
    }
    .connect-button {
        background-color: #ff007f;
        cursor: pointer;
    }
    .game-panel {
        width: 100%;
        padding: 20px;
        background-color: #222;
        border-radius: 8px;
        border: 1px solid #333;
    }
    .result-bar {
        width: 100%;
        height: 50px;
        margin-bottom: 20px;
        background-color: #444;
        border-radius: 5px;
        position: relative;
    }
    .bar {
        height: 100%;
        border-radius: 5px;
        position: relative;
    }
    .marker {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: white;
        padding: 5px 10px;
        border-radius: 5px;
        color: black;
    }
    .controls, .coin-flip {
        text-align: center;
        color: white;
    }
    .coin-result, .controls p {
        margin-bottom: 20px;
        font-size: 24px;
    }
    .coin-controls button, .roll-button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #ff007f;
        color: white;
        cursor: pointer;
        margin: 0 10px;
    }
    .coin {
        width: 200px;
        height: 200px;
        display: block;
        margin: 0 auto;
    }
    .coin.flipping {
        animation: flip 1s forwards;
    }
    @keyframes flip {
        0% { transform: rotateY(0); }
        100% { transform: rotateY(360deg); }
    }
    .dice-container {
        display: flex;
        justify-content: center;
        gap: 20px;
    }
    .dice {
        width: 100px;
        height: 100px;
    }
    .rolling {
        animation: roll 1s forwards;
    }
    @keyframes roll {
        0% { transform: rotate(0); }
        100% { transform: rotate(360deg); }
    }
    .wallet-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: opacity 0.3s;
        opacity: 0;
    }
    .wallet-modal.visible {
        opacity: 1;
        visibility: visible;
    }
    .wallet-options {
        padding: 20px;
        border-radius: 10px;
        background: #333;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .wallet-option {
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }
    .wallet-option img {
        height: 40px;
        margin-right: 10px;
    }
    .wallet-option span {
        color: white;
        font-size: 18px;
    }
    .close-button {
        position: absolute;
        top: 10px;
        right: 10px;
        border: none;
        background: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
    }
</style>
