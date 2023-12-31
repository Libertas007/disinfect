<script lang="ts">
	import { goto } from '$app/navigation';
	import { app } from '../../firebase';
	import {
		getAuth,
		reload,
		sendEmailVerification,
		sendPasswordResetEmail,
		updateProfile
	} from 'firebase/auth';
	import { user } from '../stores';
	import { setUserInfo } from '$lib/userdata';
	import toast, { Toaster } from 'svelte-french-toast';

	const auth = getAuth(app);

	let name: string = $user?.displayName ?? '';
	let verificationSent = false;

	async function update() {
		if (name === auth.currentUser!.displayName || name === '') return;

		if (name.trim().length < 3) {
			toast.error("Display name can't be less than 3 characters.");
			return;
		}

		if (name.trim().length > 20) {
			toast.error("Display name can't be more than 20 characters.");
			return;
		}

		await updateProfile($user!, {
			displayName: name.trim()
		});

		await setUserInfo({ name: name.trim(), role: '' }, $user?.uid ?? '');

		toast.success('Profile updated.');

		setTimeout(() => {
			location.reload();
		}, 2000);
	}

	async function verify() {
		await sendEmailVerification(auth.currentUser!);
		verificationSent = true;
		reload(auth.currentUser!);
	}
</script>

<svelte:head>
	<title>Dashboard</title>
	<meta name="description" content="Dashboard" />
</svelte:head>

<Toaster />

<section>
	<h1>Dashboard</h1>

	{#if $user}
		<p>Welcome, {$user.displayName}!</p>

		{#if !$user.emailVerified}
			<div class="notverified">
				{#if !verificationSent}
					<p>Your email is not verified. Verify your email to unlock all the features.</p>
					<button on:click={verify} class="danger">Send verification email</button>
				{:else}
					<p>Verification email sent. Check your inbox, please.</p>
				{/if}
			</div>
		{/if}

		<h2>Profile info</h2>
		<form id="update">
			<label for="name">Display name: </label>
			<input type="text" name="name" id="name" bind:value={name} />

			<br />
			<br />

			<button on:click|preventDefault={update}>Update profile</button>
		</form>

		<button on:click={() => auth.signOut()} class="danger">Log out</button>
	{:else}
		<p>To view the dashboard, you must be logged in.</p>
		<a href="/login">Log in</a>
	{/if}
</section>

<style>
	.notverified {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding: 0.2rem 0.5rem;
		color: var(--color-theme-2);
		width: 100%;
		border: 2px solid var(--color-theme-2);
		border-radius: 0.5rem;
	}
</style>
