import { db } from "@/firebase";
import { firestore } from "firebase/app";

export default abstract class BaseReference {
	private _ref: firestore.DocumentReference;

	constructor(collection: string, init?: string | firestore.DocumentReference) {
		const cRef = db.collection(collection);

		if (init instanceof firestore.DocumentReference) this._ref = init;
		else if (typeof init === "string") this._ref = cRef.doc(init);
		else this._ref = cRef.doc(); // create new reference if no initial provided
	}

	get ref() {
		return this._ref;
	}

	get id() {
		return this._ref.id;
	}

	async update(newData: firestore.UpdateData) {
		await this._ref.update(newData);
	}

	async delete() {
		await this._ref.delete();
	}
}
