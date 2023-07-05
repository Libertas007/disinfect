<script lang="ts">
	import type { Issue } from '$lib/issues';
	import Fa from 'svelte-fa';
	import { faCircleDot, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
	import { getUserInfo } from '$lib/userdata';

	export let issue: Issue;

	const formatter = new Intl.RelativeTimeFormat('en', { style: 'long', numeric: 'auto' });

	let difference = Math.floor(
		(new Date(Date.now()).getTime() / 1000 - issue.createdAt.seconds) / 60 / 60 / 24
	);
</script>

<div class="box">
	{#await getUserInfo(issue.author)}
		<p>Wait a minute...</p>
	{:then author}
		<div class="icon">
			<Fa icon={issue.status == 'open' ? faCircleDot : faCircleCheck} scale={2} color={'#B6383E'} />
		</div>
		<div class="content">
			<h2>
				<a href={`/issues/${issue.id}`}>
					{issue.title}
				</a>
			</h2>
			{#if !issue.closedAt}
				<p>
					Opened {formatter.format(-difference, 'days')} by {author.name}, {issue.comments.length} comments.
					Flags: {issue.flags.join(', ')}
				</p>
			{:else}
				<p>
					By {author.name}, closed {formatter.format(-difference, 'days')}, {issue.comments.length} comments.
					Flags: {issue.flags.join(', ')}
				</p>
			{/if}
		</div>
	{/await}
</div>

<style>
	.box {
		border: 3px solid var(--color-theme-1);
		border-radius: 10px;
		padding: 10px;
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 0.25rem;
	}

	.icon {
		width: 48px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	h2 {
		margin-bottom: 0;
	}

	p {
		margin-top: 0.25rem;
	}
</style>
