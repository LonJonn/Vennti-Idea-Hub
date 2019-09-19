import BaseDocument from "./BaseDocument";
import User from "./User";

import { db } from "@/firebase";

export default class Idea extends BaseDocument {
	static all = db.collection("ideas");
	static collection(ds: QuerySnap) {
		return ds.docs.map(doc => new this(doc));
	}

	status: IdeaStatus;
	description: string;
	benefit: string;
	owner: DocRef;
	assigned: DocRef[];
	createdOn: Timestamp;
	difficulty: IdeaDifficulty;
	skillsRequired: Skill[];
	timeEstimation: [number, number];
	likes: DocRef[];

	constructor(init?: string | QueryDoc) {
		super("ideas", init);
	}

	async getOwner() {
		if (!this.owner) throw new Error("No owner.");
		return await new User(this.owner.id).fetch();
	}

	getNumberOfAssigned() {
		return this.assigned.length;
	}
}
