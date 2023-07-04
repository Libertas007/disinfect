<script lang="ts">
	import type { Issue } from '$lib/issues';
	import Fa from 'svelte-fa';
	import { faCircleDot, faCircleCheck } from '@fortawesome/free-regular-svg-icons';

	export let issue: Issue;

	const formatter = new Intl.RelativeTimeFormat('en', { style: 'long', numeric: 'auto' });

	console.log(issue.createdAt);

	let difference = Math.floor(
		(new Date(Date.now()).getTime() / 1000 - issue.createdAt.seconds) / 60 / 60 / 24
	);
</script>

<div class="box">
	<div class="icon">
		<Fa icon={issue.status == 'open' ? faCircleDot : faCircleCheck} scale={2} color={'#B6383E'} />
	</div>
	<div class="content">
		<h2>
			<a href={`/issues/${issue.id}`}>
				{issue.title}
			</a>
		</h2>
		<p>
			Opened {formatter.format(-difference, 'days')} by {issue.author}.
			<a href={`/issues/${issue.id}`}>See more...</a>
		</p>
	</div>
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
