import { firestore as fs } from "firebase/app";
import { db } from "@/firebase";
import { Like } from "./typings";
import store from "@/store";
import { sortBy } from "lodash";

interface LikeMap {
	[id: string]: Like;
}

export default class Likes {
	private _data: LikeMap;
	private _ref: fs.DocumentReference;
	private _id: string;
	unsubscribe: () => void;

	constructor(ideaId: string) {
		this._ref = db.collection("likes").doc(ideaId);
		this._id = this._ref.id;
	}

	/**
	 * Creates internal listener for document changes on Firestore.
	 * Resolves instance with populated `data` property which can be used immediately.
	 * Remove listener with `.unsubscribe()`.
	 *
	 * Document changes that occur after this point ***will affect `data` automatically***,
	 * keeping the local instance in sync with the Firestore document.
	 *
	 * *SHOULD BE CALLED WHEN CREATING A NEW INSTANCE.*
	 * ---
	 * @example const idea = await new Idea(id).init();
	 */
	init() {
		if (this.unsubscribe) throw new Error(`${this._id}: Already initiated.`);

		return new Promise<this>(resolve => {
			this.unsubscribe = this._ref.onSnapshot(ds => {
				this._data = ds.data() as LikeMap;
				resolve(this); // Resolve instance after initial fetch
			});
		});
	}

	async addUserLike() {
		const { user } = store.state;

		await db
			.batch()
			.set(
				this._ref,
				{
					[user.id]: {
						ref: user.ref,
						name: user.data.name,
						modifiedAt: fs.Timestamp.now()
					} as Like
				},
				{ merge: true }
			)
			.update(db.collection("ideas").doc(this._id), {
				likesCount: fs.FieldValue.increment(1)
			})
			.commit();
	}

	async removeUserLike() {
		const { user } = store.state;

		await db
			.batch()
			.update(this._ref, {
				[user.id]: fs.FieldValue.delete()
			})
			.update(db.collection("ideas").doc(this._id), {
				likesCount: fs.FieldValue.increment(-1)
			})
			.commit();
	}

	async delete() {
		if (this.unsubscribe) this.unsubscribe();

		await this._ref.delete();
	}

	get ref() {
		return this._ref;
	}

	get data() {
		return this._data;
	}

	get ids() {
		return this._data ? Object.keys(this._data) : [];
	}

	get count() {
		return this.ids.length;
	}

	get latest() {
		if (!this._data) return [];
		return sortBy(Object.values(this._data), like => -like.modifiedAt.toDate());
	}
}
