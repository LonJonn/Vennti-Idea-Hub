import { db } from "@/firebase";
import { firestore as fs } from "firebase/app";
import BaseReference from "./BaseReference";
import { IdeaData, IdeaStatus, NewIdea, UpdateIdea, Like } from "./typings";
import store from "@/store";

export default class Idea extends BaseReference<IdeaData, UpdateIdea> {
	// Start Static
	static all = db.collection("ideas");
	static subscribe = Idea.all.onSnapshot;

	/**
	 * Creates an Idea instance from a Firestore Document Snapshot.
	 * `data` property is populated from snapshot and can be
	 * accessed ***WITHOUT*** calling `init()`
	 * @param snap Document Snapshot from a Firestore Idea
	 * @returns Pre-initialised Instance of existing Idea
	 */
	static fromExisting(snap: fs.DocumentSnapshot) {
		if (!snap.exists) throw new Error(`Idea does not exist: ${snap.id}`);

		const existing = new Idea(snap.ref);
		existing._data = snap.data() as IdeaData;
		existing._data.likes = snap.ref.collection("likes");

		return existing;
	}

	/**
	 * Similar to `.fromExisting` but used with a query of documents.
	 * `data` property of each instance is populated from snapshot
	 * and can be accessed ***WITHOUT*** calling `init()`
	 * @param querySnap Query Snapshot from a Firestore Idea query
	 * @returns Array of pre-initialised Idea instances.
	 */
	static fromCollection(querySnap: fs.QuerySnapshot) {
		return querySnap.docs.map(doc => Idea.fromExisting(doc));
	}

	/**
	 * Creates and writes a new idea to Firestore.
	 * `data` property is populated from snapshot and can be
	 * accessed ***WITHOUT*** calling `init()`
	 * @param initData Values used when creating the new Idea
	 * @returns Pre-initialised instance of the created Idea
	 */
	static async create(initData: NewIdea) {
		const payload: IdeaData = {
			...initData,
			owner: {
				ref: store.state.user.ref,
				name: store.state.user.data.name
			},
			createdOn: fs.Timestamp.now(),
			assigned: [],
			status: IdeaStatus.Open,
			userLikes: []
		};

		// Check for negative or out of order range
		const validTimeRange =
			!payload.timeEstimation.some(hours => hours < 0) &&
			payload.timeEstimation[0] < payload.timeEstimation[1];

		if (!validTimeRange) throw new Error("Invalid time estimation.");

		const newIdea = new Idea();
		newIdea.data = payload;
		newIdea._data.likes = newIdea.ref.collection("likes");

		return newIdea;
	}
	// End Static

	/**
	 * If no intial value is passed, a *new* document reference will be created within the ideas collection.
	 *
	 * Instance is **NOT** written to Firestore until calling `.ref.set` *OR* setting the `data` property.
	 * @param init Optional param for existing documents
	 */
	constructor(init?: string | fs.DocumentReference) {
		super("ideas", init);
	}

	async like() {
		const { user } = store.state;

		await db
			.batch()
			.set(
				this._data.likes.doc(user.id),
				{
					createdAt: fs.Timestamp.now(),
					name: user.data.name,
					ref: user.ref
				},
				{ merge: true }
			)
			.update(this.ref, { userLikes: fs.FieldValue.arrayUnion(store.state.user.id) })
			.commit();
	}

	async unlike() {
		const { user } = store.state;

		await db
			.batch()
			.delete(this._data.likes.doc(user.id))
			.update(this.ref, { userLikes: fs.FieldValue.arrayRemove(store.state.user.id) })
			.commit();
	}
}
