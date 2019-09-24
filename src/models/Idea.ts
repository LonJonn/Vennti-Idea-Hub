import BaseReference from "./BaseReference";
import { IdeaData, UpdateIdea, NewIdea, IdeaStatus } from "./typings";
import { db } from "@/firebase";
import { firestore as fs } from "firebase/app";
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
			owner: store.getters.userInstance.ref,
			createdOn: fs.Timestamp.now(),
			assigned: [],
			likes: [],
			status: IdeaStatus.Open
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
}
