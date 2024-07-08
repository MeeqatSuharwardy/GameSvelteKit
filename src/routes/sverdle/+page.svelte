<script>
    import { onMount } from 'svelte';
    import symbol1 from '$lib/images/symbol1.png';
    import symbol2 from '$lib/images/symbol2.png';
    import symbol3 from '$lib/images/symbol3.png';
    import symbol4 from '$lib/images/symbol4.png';

    let balance = 1000;
    let betAmount = 10;
    let slotValues = [0, 0, 0];
    let isSpinning = false;
    const symbols = [symbol1, symbol2, symbol3, symbol4];
    const numSymbols = symbols.length;

    function spinSlots() {
        if (balance < betAmount) {
            alert('Insufficient balance');
            return;
        }

        isSpinning = true;
        balance -= betAmount;

        let spinTime = 2000; // Time for which the reels will spin

        let intervalId = setInterval(() => {
            slotValues = [
                Math.floor(Math.random() * numSymbols),
                Math.floor(Math.random() * numSymbols),
                Math.floor(Math.random() * numSymbols)
            ];
        }, 100);

        setTimeout(() => {
            clearInterval(intervalId);
            slotValues = [
                Math.floor(Math.random() * numSymbols),
                Math.floor(Math.random() * numSymbols),
                Math.floor(Math.random() * numSymbols)
            ];

            if (slotValues[0] === slotValues[1] && slotValues[1] === slotValues[2]) {
                balance += betAmount * 10; // Win 10x the bet amount
                alert('You win!');
            } else {
                alert('You lose!');
            }

            isSpinning = false;
        }, spinTime);
    }

    onMount(() => {
        // Preload images
        symbols.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    });
</script>

<svelte:head>
    <title>Modern Slot Game</title>
    <meta name="description" content="A modern and cool slot game" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="game-container">
    <div class="balance">
        <h2>Balance: ${balance}</h2>
    </div>
    <div class="slots">
        {#each slotValues as value, index}
            <div class="slot">
                <div class="reel" style:transform="translateY(calc(-100% * {value}))" class:is-spinning={isSpinning}>
                    {#each symbols as symbol, idx}
                        <img src={symbol} alt={`Symbol ${idx + 1}`} class="symbol" />
                    {/each}
                </div>
            </div>
        {/each}
    </div>
    <div class="controls">
        <input type="number" bind:value={betAmount} min="1" max={balance} />
        <button on:click={spinSlots} disabled={isSpinning}>Spin</button>
    </div>
</div>

<style>
    body {
        background-color: #111;
        color: white;
        font-family: 'Roboto', sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }

    .game-container {
        text-align: center;
        background-color: #222;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }

    .balance h2 {
        margin: 10px 0;
        color: gold;
    }

    .slots {
        display: flex;
        justify-content: center;
        margin: 20px 0;
    }

    .slot {
        width: 100px;
        height: 100px;
        margin: 0 10px;
        overflow: hidden;
        background-color: #333;
        border-radius: 10px;
        position: relative;
    }

    .reel {
        display: flex;
        flex-direction: column;
        transition: transform 0.5s;
    }

    .symbol {
        width: 100%;
        height: 100px;
        flex-shrink: 0;
    }

    .is-spinning {
        animation: spin 0.1s infinite linear;
    }

    @keyframes spin {
        0% { transform: translateY(0); }
        100% { transform: translateY(-400%); }
    }

    .controls {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    .controls input {
        width: 100px;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #444;
        background-color: #333;
        color: white;
        text-align: center;
    }

    .controls button {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background-color: #ff007f;
        color: white;
        cursor: pointer;
    }

    .controls button:disabled {
        background-color: #555;
        cursor: not-allowed;
    }
</style>
