<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { closeIssue, createComment, getIssue } from '$lib/issues';
	import { getUserInfo } from '$lib/userdata';
	import Fa from 'svelte-fa';
	import { faCircleDot, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
	import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
	import { user } from '../../stores';
	import toast, { Toaster } from 'svelte-french-toast';

	let id = $page.params.id;

	const dateFormatter = Intl.DateTimeFormat('en-GB', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	let comment = '';

	async function sendComment() {
		if (comment === '') return;

		await createComment(
			{
				content: comment,
				createdAt: { seconds: Date.now() / 1000, nanoseconds: Date.now() * 1_000_000 },
				updatedAt: { seconds: Date.now() / 1000, nanoseconds: Date.now() * 1_000_000 },
				author: $user?.uid || '',
				type: 'comment'
			},
			id
		);

		toast.success('Your comment has been sent!');
		comment = '';

		setTimeout(() => location.reload(), 2000);
	}
</script>

<Toaster />

<a href="/issues"><Fa icon={faArrowLeft} /> Back</a>

{#if !$user}
	<h1>You cannot view issues without logging in!</h1>
	<button on:click={() => goto('/login')} class="cta"> Log in </button>
{:else}
	{#await getIssue(id)}
		<p>Loading the issue for you...</p>
	{:then issue}
		{#await getUserInfo(issue.author) then author}
			<h1>
				<Fa icon={issue.status == 'open' ? faCircleDot : faCircleCheck} scale={1} />
				{#if issue.status == 'closed'}
					Closed: {issue.title}
				{:else}
					{issue.title}
				{/if}
			</h1>

			<div class="content">
				<p>
					<b>{author.name}</b> created this issue {dateFormatter.format(
						issue.createdAt.seconds * 1000
					)}:
				</p>
				<p>{issue.description}</p>
			</div>

			<h2>More info</h2>
			<p><b>App version: </b> {issue.appVersion}</p>
			<p><b>Platform: </b> {issue.platform}</p>
			<p>
				<b>Flags: </b>
				{issue.flags.join(', ')}
			</p>
			{#await getUserInfo($user?.uid ?? '') then userData}
				{#if userData.role === 'admin'}
					<button
						on:click={async () => {
							await closeIssue(id);

							await createComment(
								{
									content: 'This issue has been closed.',
									createdAt: { seconds: Date.now() / 1000, nanoseconds: Date.now() * 1_000_000 },
									updatedAt: { seconds: Date.now() / 1000, nanoseconds: Date.now() * 1_000_000 },
									author: $user?.uid || '',
									type: 'closed'
								},
								id
							);

							toast.success('The issue has been closed!');
							setTimeout(() => location.reload(), 2000);
						}}
						disabled={issue.status == 'closed'}>Close issue</button
					>
				{/if}
			{/await}
			<h2>Comments:</h2>
			<div class="content">
				<h3>Make your comment</h3>
				<form action="">
					<label for="title" class="required">Comment: </label>
					<input type="text" name="title" id="title" bind:value={comment} required />
					<button on:click|preventDefault={sendComment}>Send comment</button>
				</form>
			</div>

			{#each issue.comments as comment}
				{#await getUserInfo(comment.author) then commentAuthor}
					{#if comment.type == 'closed'}
						<div class="content">
							<p>
								<b
									>{commentAuthor.name} closed this issue {dateFormatter.format(
										comment.createdAt.seconds * 1000
									)}
								</b>
							</p>
						</div>
					{:else}
						<div class="content">
							<p>
								<b>{commentAuthor.name}</b> commented {dateFormatter.format(
									comment.createdAt.seconds * 1000
								)}:
							</p>
							<p>{comment.content}</p>
						</div>
					{/if}
				{/await}
			{:else}
				<p>No comments yet.</p>
			{/each}
		{/await}
	{/await}
{/if}

<style>
	.content {
		width: 100%;
		border: 3px solid var(--color-theme-1);
		border-radius: 10px;
		padding: 10px;
		color: var(--color-theme-1);
		margin: 0.25rem;
	}
</style>
