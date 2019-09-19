import { db } from "@/firebase";
import { firestore } from "firebase/app";

export default abstract class BaseReference {
	private _ref: firestore.DocumentReference;
	id: string;

	constructor(collection: string, init?: string | firestore.DocumentReference) {
		const cRef = db.collection(collection);

		if (init instanceof firestore.DocumentReference) this._ref = init;
		else if (typeof init === "string") this._ref = cRef.doc(init);
		else this._ref = cRef.doc();

		this.id = this._ref.id;
	}

	get ref() {
		return this._ref;
	}

	async update(newData: firestore.UpdateData) {
		await this._ref.update(newData);
	}

	async delete() {
		await this._ref.delete();
	}
}
