<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '../../stores';
	import { createIssue, type Issue } from '$lib/issues';
	import toast, { Toaster } from 'svelte-french-toast';

	let title = '';
	let description = '';

	async function submitIssue() {
		if (title.length < 5) {
			toast.error('Title must be at least 5 characters long.');
			return;
		}

		if (description.length < 10) {
			toast.error('Description must be at least 10 characters long.');
			return;
		}

		const issue: Issue = {
			title,
			description,
			id: '',
			author: $user?.uid || '',
			status: 'open',
			closedAt: null,
			comments: [],
			createdAt: {
				seconds: Date.now() / 1000,
				nanoseconds: Date.now() * 1_000_000
			},
			updatedAt: {
				seconds: Date.now() / 1000,
				nanoseconds: Date.now() * 1_000_000
			}
		};

		await createIssue(issue);

		toast.success('Your issue has been submitted!');

		setTimeout(() => goto('/issues'), 2000);
	}
</script>

<svelte:head>
	<title>New issue</title>
	<meta name="description" content="Disinfect! - Bug tracker for Word'n'Seek" />
</svelte:head>

<Toaster />

<section>
	<h1>New issue</h1>

	{#if !$user}
		<p>You'll need an account to create issues.</p>
		<button class="cta" on:click={() => goto('/signup')}>Sign up!</button>
	{:else}
		<form action="" id="issueform">
			<label for="title" class="required">Title: </label>
			<input type="text" name="title" id="title" bind:value={title} required />

			<br />

			<p class="required">Description:</p>
			<textarea rows="8" name="description" id="description" bind:value={description} required />

			<p>Don't forget to add steps to reproduce the bug.</p>

			<button on:click|preventDefault={submitIssue}>Submit a new issue.</button>
		</form>
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

	textarea {
		width: 100%;
	}
</style>
