<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		applyActionCode,
		checkActionCode,
		confirmPasswordReset,
		getAuth,
		sendPasswordResetEmail,
		verifyPasswordResetCode
	} from 'firebase/auth';
	import { app } from '../../../firebase';
	import type { PageData } from './$types';

	let success = false;
	let newPassword = '';
	let message = '';

	export let data: PageData;

	const auth = getAuth(app);

	let actionCode = data.params.get('oobCode') || '';

	let verification = verifyPasswordResetCode(auth, actionCode);

	async function resetPassword() {
		if (newPassword.length < 6) {
			message = 'Password must be at least 6 characters long.';
			return;
		}

		await confirmPasswordReset(auth, actionCode, newPassword);

		success = true;
		setTimeout(() => {
			goto('/dashboard');
		}, 2000);
	}
</script>

{#await verification}
	<p>Wait a minute...</p>
{:then email}
	{#if success}
		<h1>It's all done!</h1>
		<p>Redírecting to Dashboard in 2 seconds...</p>
	{:else}
		<h1>Reset your password</h1>
		<p>You asked to reset password for {email}.</p>

		{#if message}
			<p class="error">{message}</p>
		{/if}

		<label for="newPassword">New Password</label>
		<input type="password" id="newPassword" bind:value={newPassword} required />

		<button on:click={resetPassword}>Reset password</button>
	{/if}
{/await}

<style>
	.error {
		color: var(--color-theme-2);
		font-weight: bold;
	}
</style>
