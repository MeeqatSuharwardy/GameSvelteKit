<!-- src/lib/components/PlayingCard.svelte -->
<script>
    export let value;
    const rank = value.slice(0, -1);
    const suit = value.slice(-1);
    const suitClass = {
        'S': 'spades',
        'H': 'hearts',
        'D': 'diamonds',
        'C': 'clubs'
    }[suit];
    const suitSymbol = {
        'S': '♠',
        'H': '♥',
        'D': '♦',
        'C': '♣'
    }[suit];
</script>

<div class={`card ${suitClass}`}>
    <span class="rank">{rank}</span>
    <span class="suit">{suitSymbol}</span>
</div>
<div class={`card rank-${value.slice(0, -1).toLowerCase()} ${value.slice(-1).toLowerCase()}`}>
    <span class="rank">{value.slice(0, -1)}</span>
    <span class="suit">
        {#if value.slice(-1) === 'S'}&spades;
        {:else if value.slice(-1) === 'H'}&hearts;
        {:else if value.slice(-1) === 'D'}&diams;
        {:else if value.slice(-1) === 'C'}&clubs;
        {/if}
    </span>
</div>
<style>
    @import '../cards.css';

    .card {
        width: 60px;
        height: 90px;
        display: inline-block;
        border: 1px solid #333;
        border-radius: 5px;
        background-color: white;
        text-align: center;
        line-height: 1.2;
        font-size: 20px;
        position: relative;
    }
    .card .rank {
        position: absolute;
        top: 5px;
        left: 5px;
    }
    .card .suit {
        font-size: 24px;
    }
</style>
