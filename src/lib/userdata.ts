import { app } from '../firebase';
import { getAuth } from 'firebase/auth';

interface UserInfo {
	name: string;
	role: string;
}

async function setUserInfo(userInfo: UserInfo, uid: string) {
	const user = getAuth(app).currentUser;

	await fetch(`/api/userdata/${uid}`, {
		method: 'POST',
		headers: {
			Authorization: (await user?.getIdToken()) || ''
		},
		body: JSON.stringify(userInfo)
	});
}

async function getUserInfo(uid: string): Promise<UserInfo> {
	const user = getAuth(app).currentUser;

	const res = await fetch(`/api/userdata/${uid}`, {
		method: 'GET',
		headers: {
			Authorization: (await user?.getIdToken()) || ''
		}
	});

	const data = await res.json();

	return {
		name: data.name,
		role: data.role
	};
}

export { setUserInfo, getUserInfo };
export type { UserInfo };
