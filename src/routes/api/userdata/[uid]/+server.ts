import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { initializeApp, getApp, getApps } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { createClient } from '@vercel/kv';

interface UserData {
	name: string;
	role: string;
}

getApps().length == 0
	? initializeApp({
			credential: admin.credential.cert(JSON.parse(import.meta.env.VITE_FIREBASE_AUTH))
	  })
	: getApp();

const kv = createClient({
	token: import.meta.env.VITE_KV_REST_API_TOKEN,
	url: import.meta.env.VITE_KV_REST_API_URL
});

export const GET = async function (data) {
	const uid = data.params.uid;
	const authHeader = data.request.headers.get('Authorization');

	if (!authHeader) {
		return json({ error: 'No auth header' }, { status: 401 });
	}

	try {
		await admin.auth().verifyIdToken(authHeader);

		const friendlyName: UserData = (await kv.get(uid)) ?? { name: 'Unnamed', role: '' };

		return json({ uid, name: friendlyName.name, role: friendlyName.role });
	} catch (e) {
		return json({ error: e }, { status: 401 });
	}
} satisfies RequestHandler;

export const POST = async function (data) {
	const uid = data.params.uid;
	const authHeader = data.request.headers.get('Authorization');

	try {
		const body: UserData = await data.request.json();

		if (!authHeader) {
			return json({ error: 'No auth header' }, { status: 401 });
		}

		body.role = '';

		if (body.name.length < 3) {
			return json({ error: 'Name must be at least 3 characters' }, { status: 400 });
		}

		if (body.name.length > 20) {
			return json({ error: 'Name must cannot be longer than 20 characters' }, { status: 400 });
		}

		try {
			const token = await admin.auth().verifyIdToken(authHeader);

			if (token.uid !== uid) {
				return json({ error: 'Unauthorized' }, { status: 403 });
			}

			admin.auth().updateUser(uid, { displayName: body.name });

			await kv.set(uid, JSON.stringify(body));

			return json({ uid, name: body.name, role: body.role });
		} catch (e) {
			return json({ error: e }, { status: 401 });
		}
	} catch (e) {
		return json({ error: e }, { status: 400 });
	}
} satisfies RequestHandler;
