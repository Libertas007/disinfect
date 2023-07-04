<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '../../stores';
	import { createIssue, type Issue } from '$lib/issues';
	import toast, { Toaster } from 'svelte-french-toast';
	import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	let title = '';
	let description = '';
	let platform: Platform = 'web';
	let version = '';

	type Platform = 'ios' | 'android' | 'web';

	let selectedFlags: string[] = [];
	let availableFlags = ['Bug', 'Feature', 'Enhancement', 'Documentation', 'Question', 'Design'];

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
			platform,
			appVersion: version,
			flags: selectedFlags,
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

<a href="/issues"><Fa icon={faArrowLeft} /> Back</a>

<section class="text-column">
	<h1>New issue</h1>

	{#if !$user}
		<p>You'll need an account to create issues.</p>
		<button class="cta" on:click={() => goto('/signup')}>Sign up!</button>
	{:else}
		<form action="" id="issueform">
			<h2>Basic info</h2>
			<label for="title" class="required">Title: </label>
			<input type="text" name="title" id="title" bind:value={title} required />

			<br />

			<p class="required">Description:</p>
			<textarea rows="8" name="description" id="description" bind:value={description} required />

			<p>Don't forget to add steps to reproduce the bug.</p>

			<h2>Flags</h2>

			<p>Please, select some flags that describe the question the best.</p>

			<div class="flags-select">
				<div class="first">
					<p>Selected flags</p>
					{#each selectedFlags as flag}
						<button
							on:click={() => {
								availableFlags = [...availableFlags, flag];
								selectedFlags = selectedFlags.filter((f) => f !== flag);
							}}
						>
							{flag}
						</button>
					{/each}
				</div>
				<div class="second">
					<p>Available flags</p>
					{#each availableFlags as flag}
						<button
							on:click={() => {
								selectedFlags = [...selectedFlags, flag];
								availableFlags = availableFlags.filter((f) => f !== flag);
							}}
						>
							{flag}
						</button>
					{/each}
				</div>
			</div>

			<h2>Additional info</h2>

			<label for="platform" class="required">Platform: </label>
			<select name="platform" id="platform" bind:value={platform} required>
				<option value="ios">iOS</option>
				<option value="android">Android</option>
				<option value="web">Web</option>
			</select>

			<br />

			<label for="version">App version (optional): </label>
			<input type="text" name="version" id="version" bind:value={version} />

			<br />
			<br />

			<button on:click|preventDefault={submitIssue}>Submit a new issue.</button>
		</form>
	{/if}
</section>

<style>
	textarea {
		width: 100%;
	}

	.flags-select {
		display: flex;
		justify-content: center;
		align-items: start;
	}

	.flags-select > div {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
		margin: 2px;
	}

	.flags-select > div > p {
		font-weight: bold;
	}

	.flags-select > div > button {
		width: 100%;
	}
</style>
