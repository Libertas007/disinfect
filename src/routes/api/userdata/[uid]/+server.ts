import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { initializeApp, getApp, getApps } from 'firebase-admin/app';
import { credential, auth } from 'firebase-admin';
import { kv } from '@vercel/kv';

interface UserData {
	name: string;
	role: string;
}

getApps().length == 0
	? initializeApp({
			credential: credential.cert(JSON.parse(import.meta.env.VITE_FIREBASE_AUTH))
	  })
	: getApp();

export const GET = async function (data) {
	const uid = data.params.uid;
	const authHeader = data.request.headers.get('Authorization');

	if (!authHeader) {
		return json({ error: 'No auth header' }, { status: 401 });
	}

	try {
		await auth().verifyIdToken(authHeader);

		const friendlyName = await kv.get<UserData>(uid);

		return json({ uid, name: friendlyName?.name, role: friendlyName?.role });
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
			const token = await auth().verifyIdToken(authHeader);

			if (token.user.uid !== uid) {
				return json({ error: 'Unauthorized' }, { status: 403 });
			}

			await kv.set(uid, body);

			const friendlyName = await kv.get<UserData>(uid);

			return json({ uid, name: friendlyName?.name, role: friendlyName?.role });
		} catch (e) {
			return json({ error: e }, { status: 401 });
		}
	} catch (e) {
		return json({ error: e }, { status: 400 });
	}
} satisfies RequestHandler;
