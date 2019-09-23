import BaseReference from "./BaseReference";
import { IdeaData, UpdateIdea, NewIdea, IdeaStatus } from "./typings";
import { db } from "@/firebase";
import { firestore as fs } from "firebase/app";
import store from "@/store";

export default class Idea extends BaseReference<IdeaData, UpdateIdea> {
	// Start Static
	static all = db.collection("ideas");
	static subscribe = Idea.all.onSnapshot;

	static fromExisting(snap: fs.DocumentSnapshot) {
		if (!snap.exists) throw new Error(`Idea does not exist: ${snap.id}`);

		const existing = new Idea(snap.ref);
		existing._data = snap.data() as IdeaData;

		return existing;
	}

	static fromCollection(querySnap: fs.QuerySnapshot) {
		return querySnap.docs.map(doc => Idea.fromExisting(doc));
	}

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

	constructor(init?: string | fs.DocumentReference) {
		super("ideas", init);
	}
}
