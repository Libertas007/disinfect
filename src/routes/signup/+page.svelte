<script lang="ts">
	import { goto } from '$app/navigation';
	import { Toaster, toast } from 'svelte-french-toast';
	import { app } from '../../firebase';
	import {
		getAuth,
		GithubAuthProvider,
		signInWithPopup,
		createUserWithEmailAndPassword,
		updateProfile
	} from 'firebase/auth';
	import { userStore } from 'sveltefire';
	import { setUserInfo } from '$lib/userdata';

	let name: string = '';
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

		if (name.trim().length < 3) {
			toast.error("Display name can't be less than 3 characters.");
			return;
		}

		if (name.trim().length > 20) {
			toast.error("Display name can't be more than 20 characters.");
			return;
		}

		if (password.trim().length < 6) {
			toast.error("Password can't be less than 6 characters.");
			return;
		}

		try {
			await createUserWithEmailAndPassword(auth, email, password);
			await updateProfile(auth.currentUser!, {
				displayName: name.trim()
			});

			await setUserInfo({ name: name.trim(), role: '' }, $user?.uid ?? '');

			toast.success('Account created successfully!');

			setTimeout(() => {
				goto('/');
			}, 2000);
		} catch (error: any) {
			errorCode = error.code || 'unknown';
			errorMessage = messages.get(errorCode) || 'Unknown error.';
		}
	}
</script>

<svelte:head>
	<title>Sign up</title>
	<meta name="description" content="Sign up for Disinfect" />
</svelte:head>

<Toaster />

<section>
	<h1>Sign up for Disinfect!</h1>

	{#if errorMessage}
		<p class="error">{errorMessage}</p>
	{/if}

	<form action="" id="loginform">
		<label for="name" class="required">Display name: </label>
		<input type="text" name="name" id="name" bind:value={name} required />

		<br />

		<label for="email" class="required">Email: </label>
		<input type="email" name="email" id="email" bind:value={email} required />

		<br />

		<label for="password" class="required">Password: </label>
		<input type="password" name="password" id="password" bind:value={password} required />

		<br />
		<br />

		<a href="/login">Already have an account? Log in!</a>

		<br />
		<br />

		<div class="options">
			<button on:click|preventDefault={onSignInWithEmail}>Sign up using email</button>
		</div>
	</form>
</section>

<style>
	.error {
		color: var(--color-theme-2);
		font-weight: bold;
	}
</style>
