<script lang="ts">
	import { goto } from '$app/navigation';
	import { app } from '../../firebase';
	import {
		getAuth,
		signInWithEmailAndPassword,
		GithubAuthProvider,
		signInWithPopup
	} from 'firebase/auth';
	import { userStore } from 'sveltefire';

	let email: string = '';
	let password: string = '';

	let errorMessage: string = '';
	let errorCode: string = '';

	const messagesObj = {
		'auth/email-already-in-use': 'Email already in use.',
		'auth/invalid-email': 'Invalid email.',
		'auth/operation-not-allowed': 'Operation not allowed.',
		'auth/weak-password': 'Weak password.'
	};

	const messages = new Map(Object.entries(messagesObj));

	const auth = getAuth(app);

	const user = userStore(auth);

	async function onSignInWithEmail() {
		let loginform = document.getElementById('loginform')!;
		let invalid = loginform.querySelectorAll('input:invalid');

		if (invalid.length != 0) return;

		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (error: any) {
			errorCode = error.code || 'unknown';
			errorMessage = messages.get(errorCode) || 'Unknown error.';
		}
	}

	user.subscribe((user) => {
		if (user) {
			goto('/');
		}
	});
</script>

<svelte:head>
	<title>Log in</title>
	<meta name="description" content="Log in to Bug tracker for Word'n'Seek" />
</svelte:head>

<section>
	<h1>Log in to Bug tracker</h1>

	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}

	<form action="" id="loginform">
		<label for="email" class="required">Email: </label>
		<input type="email" name="email" id="email" bind:value={email} required />

		<br />

		<label for="password" class="required">Password: </label>
		<input type="password" name="password" id="password" bind:value={password} required />

		<br />
		<a href="/reset-password">Have you forgotten your password? Get a new one!</a>
		<br />
		<br />
		<a href="/signup">Don't have an account? Sign up!</a>

		<br />
		<br />

		<div class="options">
			<button on:click|preventDefault={onSignInWithEmail}>Log in using email</button>
		</div>
	</form>
</section>

<style>
	.error {
		color: var(--color-theme-2);
		font-weight: bold;
	}
</style>
