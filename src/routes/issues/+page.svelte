<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '../stores';
	import { getIssues, type Issue } from '$lib/issues';
	import IssueSmall from '$lib/components/IssueSmall.svelte';

	interface Predicate {
		status?: 'open' | 'closed';
		author?: string;
		flag?: string;
	}

	let predicate: Predicate = {};

	function matchesPredicate(issue: Issue, predicate: Predicate) {
		if (predicate.status && issue.status !== predicate.status) return false;
		if (predicate.author && issue.author.trim().includes(predicate.author.trim())) return false;
		if (predicate.flag && !issue.flags.includes(predicate.flag)) return false;
		return true;
	}

	function filterIssues(issues: Issue[], predicate: Predicate) {
		return issues.filter((issue) => matchesPredicate(issue, predicate));
	}
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
		<button class="cta" on:click={() => goto('/issues/new')}>New issue</button>
		<h2>Filter issues:</h2>

		<form action="">
			<label for="status">Status: </label>
			<select name="status" id="status" bind:value={predicate.status}>
				<option value={undefined} />
				<option value="open">Open</option>
				<option value="closed">Closed</option>
			</select>

			<label for="author">Author: </label>
			<input type="text" name="author" id="author" bind:value={predicate.author} />

			<label for="flag">Flag: </label>
			<select name="flag" id="flag" bind:value={predicate.flag}>
				<option value={undefined} />
				<option value="Bug">Bug</option>
				<option value="Feature">Feature</option>
				<option value="Enhancement">Enhancement</option>
				<option value="Documentation">Documentation</option>
				<option value="Question">Question</option>
				<option value="Design">Design</option>
			</select>
		</form>
		{#await getIssues()}
			<p>Loading issues...</p>
		{:then issues}
			{#key filterIssues(issues, predicate)}
				{#each filterIssues(issues, predicate).sort((a, b) => b.createdAt.seconds - a.createdAt.seconds) as issue}
					<IssueSmall {issue} />
				{:else}
					<p>No issues to show...</p>
				{/each}
			{/key}
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
