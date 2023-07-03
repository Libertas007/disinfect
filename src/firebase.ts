import { getApp, getApps, initializeApp, deleteApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: 'wordnseek.firebaseapp.com',
	projectId: 'wordnseek',
	storageBucket: 'wordnseek.appspot.com',
	messagingSenderId: '410709736673',
	appId: '1:410709736673:web:89bc7f27ee05f8a1d38ba0',
	measurementId: 'G-7LX71ST2RL'
};

getApps().forEach((app) => {
	deleteApp(app);
});

const app = getApps().length == 0 ? initializeApp(firebaseConfig) : getApp();

export { app };
