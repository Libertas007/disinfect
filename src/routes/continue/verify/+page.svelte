<script lang="ts">
	import { goto } from '$app/navigation';
	import { applyActionCode, getAuth } from 'firebase/auth';
	import { app } from '../../../firebase';
	import type { PageData } from './$types';

	let success = false;

	export let data: PageData;
	const auth = getAuth(app);

	let actionCode = data.params.get('oobCode') || '';

	let action = applyActionCode(auth, actionCode);

	action.then(() => {
		setTimeout(() => {
			goto('/dashboard');
		}, 2000);
	});
</script>

{#await action}
	<p>Wait a minute, loading data.</p>
{:then _}
	<h1>Your email has been confirmed</h1>
	<p>Redírecting to Dashboard in 2 seconds...</p>
{/await}
