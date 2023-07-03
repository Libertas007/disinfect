<script>
	import { goto } from '$app/navigation';
</script>

<svelte:head>
	<title>Disinfect! - Home</title>
	<meta name="description" content="Bug tracker for Word'n'Seek" />
</svelte:head>

<section>
	<h1>Disinfect!</h1>

	<h2>
		Find and report bugs in <a href="https://word-n-seek.com/">Word'n'Seek</a>
	</h2>

	<p>To get started, create an account!</p>
	<button class="cta" on:click={() => goto('/signup')}>Sign up!</button>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}
</style>
