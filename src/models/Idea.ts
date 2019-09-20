import BaseReference from "./BaseReference";
import { IdeaData, UpdateIdea, NewIdea, IdeaStatus } from "./typings";
import { db } from "@/firebase";
import { firestore as fs } from "firebase/app";
import store from "@/store";

export default class Idea extends BaseReference {
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

	private _data: IdeaData;

	constructor(init?: string | fs.DocumentReference) {
		super("ideas", init);
	}

	get data() {
		return this._data;
	}

	set data(payload: IdeaData) {
		this.ref.set(payload);
		this._data = payload;
	}

	async init() {
		if (this._data) throw new Error(`${this.id}: Already initiated.`);

		const doc = await this.ref.get();
		this._data = doc.data() as IdeaData;

		return this;
	}

	// Is there a better way to do this?
	async update(newData: UpdateIdea) {
		Object.assign(this._data, newData);
		await super.update(newData);
	}
}
