<script lang="ts">
	import { goto } from '$app/navigation';

	import Fa from 'svelte-fa';
	import { faSprayCanSparkles } from '@fortawesome/free-solid-svg-icons';
	import { user } from './stores';
</script>

<svelte:head>
	<title>Disinfect! - Home</title>
	<meta name="description" content="A bug tracker for Word'n'Seek" />
</svelte:head>

<section>
	<Fa icon={faSprayCanSparkles} size="5x" />
	<h1>Disinfect!</h1>

	<h2>
		Find and report bugs in <a href="https://word-n-seek.com/">Word'n'Seek</a>
	</h2>

	{#if !$user}
		<p>Create an account to get started!</p>
		<button class="cta" on:click={() => goto('/signup')}>Sign up!</button>
	{:else}
		<p>Welcome, {$user.displayName}!</p>
		<button class="cta" on:click={() => goto('/issues')}>Browse issues</button>
	{/if}
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
