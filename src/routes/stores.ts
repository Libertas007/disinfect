import { getAuth } from 'firebase/auth';
import { writable } from 'svelte/store';
import { userStore } from 'sveltefire';
import { app } from '../firebase';

export const auth = getAuth(app);
export const user = userStore(auth);
export const currentlyBrowsing = writable('none');
