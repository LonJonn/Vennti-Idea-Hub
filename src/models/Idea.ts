import { db } from "@/firebase";
import { firestore as fs } from "firebase/app";
import BaseReference from "./BaseReference";
import { IdeaData, IdeaStatus, NewIdea, UpdateIdea, Like, Assignment } from "./typings";
import store from "@/store";

// Global store
const { state } = store;

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
				ref: state.user.ref,
				name: state.user.data.name
			},
			createdOn: fs.Timestamp.now(),
			assignments: [],
			status: IdeaStatus.Open,
			likes: []
		};

		// Check for negative or out of order range
		const validTimeRange =
			!payload.timeEstimation.some(hours => hours < 0) &&
			payload.timeEstimation[0] < payload.timeEstimation[1];

		if (!validTimeRange) throw new Error("Invalid time estimation.");

		const newIdea = new Idea();
		newIdea.data = payload;

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

	async addLike(type: string = "👍") {
		await db
			.batch()
			.set(
				this.ref.collection("likes").doc(state.user.id),
				{
					createdAt: fs.Timestamp.now(),
					name: state.user.data.name,
					ref: state.user.ref,
					type
				} as Like,
				{ merge: true }
			)
			.update(this.ref, { likes: fs.FieldValue.arrayUnion(state.user.id) })
			.commit();
	}

	async removeLike() {
		await db
			.batch()
			.delete(this.ref.collection("likes").doc(state.user.id))
			.update(this.ref, { likes: fs.FieldValue.arrayRemove(state.user.id) })
			.commit();
	}

	async assignUser() {
		await db
			.batch()
			.set(
				this.ref.collection("assignments").doc(state.user.id),
				{
					assignedAt: fs.Timestamp.now(),
					name: state.user.data.name,
					ref: state.user.ref
				} as Assignment,
				{ merge: true }
			)
			.update(this.ref, { assignments: fs.FieldValue.arrayUnion(state.user.id) })
			.commit();
	}

	async unassignUser() {
		await db
			.batch()
			.delete(this.ref.collection("assignments").doc(state.user.id))
			.update(this.ref, { assignments: fs.FieldValue.arrayRemove(state.user.id) })
			.commit();
	}
}
