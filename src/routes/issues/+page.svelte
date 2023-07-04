<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '../stores';
	import { getIssues } from '$lib/issues';
	import IssueSmall from '$lib/components/IssueSmall.svelte';
</script>

<svelte:head>
	<title>Issues</title>
	<meta name="description" content="Disinfect! - Bug tracker for Word'n'Seek" />
</svelte:head>

<section>
	<h1>Issues</h1>

	{#if !$user}
		<p>Create an account to get started!</p>
		<button class="cta" on:click={() => goto('/signup')}>Sign up!</button>
	{:else}
		{#await getIssues()}
			<p>Loading issues...</p>
		{:then issues}
			{#each issues as issue}
				<IssueSmall {issue} />
			{/each}
		{/await}
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
</style>
