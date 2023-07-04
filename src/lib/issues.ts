import {
	getFirestore,
	doc,
	addDoc,
	updateDoc,
	getDoc,
	getDocs,
	collection
} from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

interface Issue {
	id: string;
	title: string;
	description: string;
	status: 'open' | 'closed';
	createdAt: DateLike;
	updatedAt: DateLike;
	closedAt: DateLike | null;
	author: string;
	comments: Comment[];
	flags: string[];
	platform: 'web' | 'android' | 'ios';
	appVersion: string;
}

interface Comment {
	content: string;
	createdAt: DateLike;
	updatedAt: DateLike;
	author: string;
}

interface DateLike {
	seconds: number;
	nanoseconds: number;
}

async function createIssue(issue: Issue) {
	const ref = await addDoc(collection(db, 'issues'), issue);

	await updateDoc(ref, {
		id: ref.id
	});
}

async function createComment(comment: Comment, forId: string) {
	const ref = doc(db, 'issues', forId);

	await updateDoc(ref, {
		comments: [...(await getIssue(forId)).comments, comment]
	});
}

async function getIssue(id: string): Promise<Issue> {
	const issue = await getDoc(doc(db, 'issues', id));
	return issue.data() as Issue;
}

async function getIssues(): Promise<Issue[]> {
	const issues = await getDocs(collection(db, 'issues'));
	return issues.docs.map((d) => d.data()) as Issue[];
}

async function closeIssue(id: string) {
	const ref = doc(db, 'issues', id);

	await updateDoc(ref, {
		status: 'closed',
		closedAt: new Date(Date.now())
	});
}

export { createIssue, createComment, getIssue, getIssues, closeIssue };
export type { Issue, Comment };
