<script>
	import { page } from '$app/stores';

	const games = [
		{ name: 'Poker', link: '/poker', color: '#00796b', icon: '🃏' },
	];
</script>

<svelte:head>
	<title>VulcanTech Casino</title>
	<meta name="description" content="Svelte demo app with casino theme" />
</svelte:head>

<section class="grid-container">
	{#each games as game}
		<a href={game.link} class="game-card" style="background-color: {game.color};">
			<div class="icon">{game.icon}</div>
			<div class="name">{game.name}</div>
		</a>
	{/each}
</section>

<style>
	body {
		background-color: #111;
		color: white;
		font-family: 'Roboto', sans-serif;
	}

	nav {
		background-color: #222;
		padding: 1rem;
		border-bottom: 2px solid #333;
	}

	ul {
		list-style: none;
		display: flex;
		justify-content: center;
		padding: 0;
		margin: 0;
	}

	li {
		margin: 0 1rem;
	}

	a {
		color: white;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 5px;
	}

	a:hover,
	li[aria-current='page'] > a {
		background-color: #ff007f;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
		padding: 2rem;
	}

	.game-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		border-radius: 10px;
		color: white;
		text-decoration: none;
		font-size: 1.5rem;
	}

	.icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.name {
		font-weight: bold;
	}
</style>
