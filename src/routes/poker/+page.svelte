<script>
import { onMount } from 'svelte';
import PokerTable from '$lib/components/PokerTable.svelte'; // Create this component for poker game logic
import WalletConnectLogo from '$lib/images/walletconnect.png';
import CoinbaseWalletLogo from '$lib/images/coinbasewallet.png';
import TrustWalletLogo from '$lib/images/trustwallet.png';
import LedgerLogo from '$lib/images/ledger.png';

let connected = false;
let showWalletOptions = false;

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
    const images = [WalletConnectLogo, CoinbaseWalletLogo, TrustWalletLogo, LedgerLogo];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});
</script>

<svelte:head>
    <title>Professional Poker Game</title>
    <meta name="description" content="A professional poker game app" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="game-container">
    <PokerTable />
    <button class="connect-button" on:click={connectWallet}>
        {connected ? 'Wallet Connected' : 'Connect Wallet'}
    </button>
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
        align-items: center;
        padding: 20px;
    }
    .connect-button {
        background-color: #ff007f;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        color: white;
        font-weight: bold;
        margin-top: 20px;
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
