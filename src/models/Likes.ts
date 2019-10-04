import { firestore as fs } from "firebase/app";
import { db } from "@/firebase";
import { Like } from "./typings";
import store from "@/store";
import { sortBy } from "lodash";
import BaseReference from "./BaseReference";

interface LikeMap {
	[id: string]: Like;
}

export default class Likes extends BaseReference<LikeMap, LikeMap> {
	static all = db.collection("likes");

	private _parentIdeaRef: fs.DocumentReference;

	constructor(ideaId: string) {
		super("likes", ideaId);
		this._parentIdeaRef = db.collection("ideas").doc(this.id);
	}

	async add() {
		const { user } = store.state;

		await db
			.batch()
			.set(
				this.ref,
				{
					[user.id]: {
						ref: user.ref,
						name: user.data.name,
						createdAt: fs.Timestamp.now()
					} as Like
				},
				{ merge: true }
			)
			.update(this._parentIdeaRef, {
				likesCount: fs.FieldValue.increment(1)
			})
			.commit();
	}

	async remove() {
		const { user } = store.state;

		await db
			.batch()
			.update(this.ref, {
				[user.id]: fs.FieldValue.delete()
			})
			.update(this._parentIdeaRef, {
				likesCount: fs.FieldValue.increment(-1)
			})
			.commit();
	}

	get userIds() {
		return this._data ? Object.keys(this._data) : [];
	}

	get count() {
		return this.userIds.length;
	}

	get byLatest() {
		if (!this._data) return [];
		return sortBy(Object.values(this._data), like => -like.createdAt.toDate());
	}
}
