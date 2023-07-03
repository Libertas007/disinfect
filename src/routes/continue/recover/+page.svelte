<script lang="ts">
	import { goto } from '$app/navigation';
	import { applyActionCode, checkActionCode, getAuth, sendPasswordResetEmail } from 'firebase/auth';
	import { app } from '../../../firebase';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	let success = false;
	let checkEmail = false;
	const auth = getAuth(app);
	let restoredEmail = '';

	export let data: PageData;

	const actionCode = data.params.get('oobCode') || '';

	// Confirm the action code is valid.
	let check = checkActionCode(auth, actionCode).then((info) => {
		// Get the restored email address.
		restoredEmail = info.data.email ?? '';

		// Revert to the old email.
		return applyActionCode(auth, actionCode);
	});

	check.then(() => {
		success = true;
	});

	async function resetPassword() {
		await sendPasswordResetEmail(auth, restoredEmail);
	}
</script>

{#await check}
	<p>Wait a minute...</p>
{:then _}
	<h1>Your email has been recovered.</h1>

	{#if checkEmail}
		<p>Check your email for a link to reset your password.</p>
	{:else}
		<p>You may also want to reset your password.</p>
		<button on:click={resetPassword}>Reset Password</button>
	{/if}
{/await}
