<script lang="ts">
	import { sendPasswordResetEmail } from 'firebase/auth';
	import { auth } from '../stores';

	let email = '';
	let sent = false;

	async function resetPassword() {
		if (email == '') return;

		await sendPasswordResetEmail(auth, email);
		sent = true;
	}
</script>

<h1>Reset your password</h1>

{#if sent}
	<p>An email has been sent to {email} with instructions to reset your password.</p>
{:else}
	<p>Fill in the email address you used when creating the account.</p>

	<form action="">
		<label for="email" class="required">Your email: </label>
		<input type="email" name="email" id="email" bind:value={email} required />
		<br />

		<button on:click|preventDefault={resetPassword}>Reset password</button>
	</form>
{/if}
