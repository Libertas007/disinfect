import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

interface UserInfo {
	name: string;
	role: string;
}

async function setUserInfo(userInfo: UserInfo, uid: string) {
	await setDoc(doc(db, 'userdata', uid), userInfo);
}

async function getUserInfo(uid: string) {
	const userInfo = await getDoc(doc(db, 'userdata', uid));
	return userInfo.data() as UserInfo;
}

export { setUserInfo, getUserInfo };
export type { UserInfo };
